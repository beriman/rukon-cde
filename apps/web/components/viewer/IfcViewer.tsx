'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
// @ts-ignore - Three.js examples types not available for this version
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SmartReviewPanel } from './SmartReviewPanel';
import { Button } from '../ui/button';
import { ClipboardCheck, Clock, Settings2, DollarSign } from 'lucide-react';
import type { IFCModel } from 'web-ifc-three/IFC/components/IFCModel';
import { TimeController } from './TimeController';
import { GanttPanel } from './GanttPanel';
import { simulationService, SimulationLink } from '@/lib/api/simulation.service';
import { scheduleService, ScheduleTask } from '@/lib/api/schedule.service';
import { CostPanel } from './CostPanel';
import { costService, CostMapping } from '@/lib/api/cost.service';

interface IfcViewerProps {
    modelUrl: string;
    projectId: string;
    fileId: string;
}

export function IfcViewer({ modelUrl, projectId, fileId }: IfcViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // State for Smart Review & 4D
    const [ifcModel, setIfcModel] = useState<IFCModel | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [is4DOpen, setIs4DOpen] = useState(false);
    const [isCostOpen, setIsCostOpen] = useState(false);
    
    // Cycle 3: Spatial Bookmarks
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const controlsRef = useRef<any>(null);
    const [simDate, setSimDate] = useState<Date>(new Date('2024-01-01'));
    const [links, setLinks] = useState<SimulationLink[]>([]);
    const [tasks, setTasks] = useState<ScheduleTask[]>([]);
    const [costMappings, setCostMappings] = useState<CostMapping[]>([]);
    const [guidMap, setGuidMap] = useState<Record<string, number>>({});

    // Selection State
    const [selectedGuid, setSelectedGuid] = useState<string | null>(null);
    const [selectedExpressId, setSelectedExpressId] = useState<number | null>(null);

    // Refs for optimization
    const ifcLoaderRef = useRef<IFCLoader | null>(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

    useEffect(() => {
        if (!containerRef.current || !modelUrl) return;

        const container = containerRef.current;

        // Setup Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f2f5);

        // Setup Camera
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(10, 10, 10);
        cameraRef.current = camera;

        // Setup Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Setup Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controlsRef.current = controls;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(10, 20, 10);
        scene.add(directionalLight);

        // Grid
        const gridHelper = new THREE.GridHelper(50, 50);
        scene.add(gridHelper);

        // Setup IFC Loader
        const ifcLoader = new IFCLoader();
        ifcLoaderRef.current = ifcLoader;
        ifcLoader.ifcManager.setWasmPath('/wasm/');

        ifcLoader.load(
            modelUrl,
            async (model) => {
                scene.add(model);
                setIfcModel(model as unknown as IFCModel);
                setLoadingProgress(100);

                // Build GUID Map (Efficient Chunked Processing)
                // We use requestIdleCallback pattern (simulated with setTimeout) to avoid freezing UI
                setTimeout(async () => {
                    if (!ifcLoader.ifcManager) return;

                    try {
                        console.time("GUID Mapping");
                        const manager = ifcLoader.ifcManager;
                        const modelID = model.modelID;

                        // Get all lines - this is fast in web-ifc
                        // 0 means all lines. But better to filter by type if possible. 
                        // However, getting all props for checking GlobalId is the bottleneck.
                        // We will iterate ALL items, but in chunks.

                        // Optimization: Get only IFCPRODUCT (physical items) if we knew the type ID.
                        // Standard IFCPRODUCT type ID is often internal. 
                        // Let's rely on getAllItems which returns IDs.
                        // @ts-ignore - getAllItems exists at runtime but not in type definitions
                        const allItemIds = await manager.getAllItems(modelID);

                        const newGuidMap: Record<string, number> = {};
                        const CHUNK_SIZE = 1000;
                        let processed = 0;

                        const processChunk = async () => {
                            const chunkEnd = Math.min(processed + CHUNK_SIZE, allItemIds.length);

                            // Process chunk
                            for (let i = processed; i < chunkEnd; i++) {
                                const expressID = allItemIds[i];
                                try {
                                    // Use getItemProperties which is faster than getProperties
                                    const props = await manager.getItemProperties(modelID, expressID);
                                    if (props.GlobalId && props.GlobalId.value) {
                                        newGuidMap[props.GlobalId.value] = expressID;
                                    }
                                } catch (e) {
                                    // Ignore items without props
                                }
                            }

                            processed = chunkEnd;

                            if (processed < allItemIds.length) {
                                // Update progress slightly if we wanted
                                setTimeout(processChunk, 10); // Schedule next chunk
                            } else {
                                console.timeEnd("GUID Mapping");
                                console.log(`Mapped ${Object.keys(newGuidMap).length} GUIDs`);
                                setGuidMap(newGuidMap);
                            }
                        };

                        processChunk(); // Start processing

                    } catch (e) {
                        console.error("Failed to map GUIDs", e);
                    }
                }, 1000);
            },
            (progress: any) => {
                setLoadingProgress((progress.loaded / progress.total) * 100);
            },
            (err: any) => {
                console.error('Error loading IFC:', err);
                setError('Failed to load IFC file.');
            }
        );


        // Raycasting setup
        // raycasterRef.current.firstHitOnly = true; 
        const mouse = new THREE.Vector2();

        const handleClick = async (event: MouseEvent) => {
            const model = scene.children.find(c => c.type === 'Mesh') as unknown as IFCModel;
            const loader = ifcLoaderRef.current;
            if (!model || !loader) return;

            const bounds = container.getBoundingClientRect();
            mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
            mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

            raycasterRef.current.setFromCamera(mouse, camera);

            const intersects = raycasterRef.current.intersectObjects([model]);
            if (intersects.length > 0) {
                const index = intersects[0].faceIndex;
                if (index === undefined || index === null) return;

                const id = loader.ifcManager.getExpressId(model.geometry, index as number);
                setSelectedExpressId(id);

                // Highlight selection
                const highlightMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffe600,
                    depthTest: false,
                    transparent: true,
                    opacity: 0.6
                });

                loader.ifcManager.createSubset({
                    modelID: model.modelID,
                    ids: [id],
                    material: highlightMaterial,
                    removePrevious: true,
                    customID: 'selection-highlight',
                });

                try {
                    const props = await loader.ifcManager.getItemProperties(model.modelID, id);
                    if (props && props.GlobalId) {
                        setSelectedGuid(props.GlobalId.value);
                    }
                } catch (e) {
                    console.error('Failed to get props', e);
                }
            } else {
                setSelectedExpressId(null);
                setSelectedGuid(null);
                loader.ifcManager.removeSubset(model.modelID, undefined, 'selection-highlight');
            }
        };

        container.addEventListener('click', handleClick);

        // Animation Loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // 4D Visualization Loop moved to effect

        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (container) {
                container.removeEventListener('click', handleClick);
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            cancelAnimationFrame(animationId);
        };
    }, [modelUrl]);

    // Fetch links and tasks when 4D is opened
    useEffect(() => {
        if (is4DOpen && projectId) {
            simulationService.getLinks(projectId).then(setLinks).catch(console.error);
            scheduleService.getTasks(projectId).then(setTasks).catch(console.error);
        }
    }, [is4DOpen, projectId]);

    useEffect(() => {
        if (isCostOpen && projectId) {
            console.log("Fetching cost mappings...");
            costService.getMappings(projectId).then(setCostMappings).catch(console.error);
        }
    }, [isCostOpen, projectId]);

    // 5D Visualization Loop (Heatmap)
    useEffect(() => {
        if (!ifcModel || !isCostOpen || costMappings.length === 0) return;

        const loader = ifcLoaderRef.current;
        if (!loader) return;

        console.log("Applying 5D Heatmap", costMappings.length);

        // 1. Calculate Costs and Bins
        const amounts = costMappings.map(m => m.boqItem?.amount || 0);
        const maxAmount = Math.max(...amounts, 1); // Avoid div by 0
        const minAmount = Math.min(...amounts);

        // Materials for bins: 0-20%, 20-40%, 40-60%, 60-80%, 80-100%
        // Green -> Red
        const materials = [
            new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8, depthTest: false }), // Low
            new THREE.MeshBasicMaterial({ color: 0xadff2f, transparent: true, opacity: 0.8, depthTest: false }),
            new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.8, depthTest: false }), // Med
            new THREE.MeshBasicMaterial({ color: 0xffa500, transparent: true, opacity: 0.8, depthTest: false }),
            new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8, depthTest: false }), // High
        ];

        // 2. Bin Elements
        const bins: number[][] = [[], [], [], [], []]; // IDs for each bin

        costMappings.forEach(m => {
            const amount = m.boqItem?.amount || 0;
            const t = (amount - minAmount) / (maxAmount - minAmount);
            const binIndex = Math.min(Math.floor(t * 5), 4);

            // Lookup Express ID
            const expressID = guidMap[m.elementGuid];
            if (expressID) {
                bins[binIndex].push(expressID);
            }
        });

        // 3. Create Subsets
        bins.forEach((ids, index) => {
            if (ids.length > 0) {
                loader.ifcManager.createSubset({
                    modelID: ifcModel.modelID,
                    ids: ids,
                    material: materials[index],
                    removePrevious: true,
                    customID: `5d-bin-${index}`, // Custom ID to manage subsets
                });
            } else {
                loader.ifcManager.removeSubset(ifcModel.modelID, undefined, `5d-bin-${index}`);
            }
        });

    }, [isCostOpen, costMappings, ifcModel]);

    // Update 4D Visualization based on Date
    useEffect(() => {
        if (!ifcModel || !is4DOpen || links.length === 0 || tasks.length === 0) return;

        const loader = ifcLoaderRef.current;
        if (!loader) return;

        // 1. Identify Valid Tasks for Date
        const activeTasks = tasks.filter(t => {
            const start = new Date(t.startDate);
            const end = new Date(t.endDate);
            return simDate >= start && simDate <= end;
        });
        const activeTaskIds = new Set(activeTasks.map(t => t.id));

        // 2. Find Links for Active Tasks
        const activeLinks = links.filter(l => activeTaskIds.has(l.taskId));

        // 3. Collect ExpressIDs using GUID Map
        const activeElementIds: number[] = [];
        activeLinks.forEach(l => {
            const id = guidMap[l.elementId]; // elementId is GUID
            if (id) activeElementIds.push(id);
        });

        // 4. Create Subset for Active Elements
        const highlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00, depthTest: false, transparent: true, opacity: 0.8 });

        if (activeElementIds.length > 0) {
            loader.ifcManager.createSubset({
                modelID: ifcModel.modelID,
                ids: activeElementIds,
                material: highlightMaterial,
                removePrevious: true,
                customID: '4d-highlight',
            });
        } else {
            loader.ifcManager.removeSubset(ifcModel.modelID, undefined, '4d-highlight');
        }

    }, [simDate, links, tasks, ifcModel, is4DOpen]);

    const handleFocus = async (expressId: number) => {
        const loader = ifcLoaderRef.current;
        const camera = cameraRef.current;
        if (!ifcModel || !loader || !camera) return;

        console.log('Focusing', expressId);

        try {
            // Highlight selected element
            const focusMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                depthTest: false,
                transparent: true,
                opacity: 0.6
            });

            loader.ifcManager.createSubset({
                modelID: ifcModel.modelID,
                ids: [expressId],
                material: focusMaterial,
                removePrevious: true,
                customID: 'selection-highlight',
            });

            // @ts-ignore - web-ifc-three types might be missing the customID string overload
            const subset = loader.ifcManager.getSubset(ifcModel.modelID, 'selection-highlight');
            if (subset) {
                subset.geometry.computeBoundingBox();
                const box = subset.geometry.boundingBox;
                if (box) {
                    const center = new THREE.Vector3();
                    box.getCenter(center);

                    // Move camera
                    const distance = box.getSize(new THREE.Vector3()).length() * 2;
                    const direction = camera.position.clone().sub(center).normalize();
                    const newPosition = center.clone().add(direction.multiplyScalar(distance || 5));

                    camera.position.copy(newPosition);
                    camera.lookAt(center);

                    // Update express ID and GUID
                    setSelectedExpressId(expressId);
                    const props = await loader.ifcManager.getItemProperties(ifcModel.modelID, expressId);
                    if (props && props.GlobalId) {
                        setSelectedGuid(props.GlobalId.value);
                    }
                }
            }
        } catch (e) {
            console.error('Focus error', e);
        }
    };

    const handleHighlightGuids = (guids: string[]) => {
        const loader = ifcLoaderRef.current;
        if (!ifcModel || !loader || guids.length === 0) {
            if (ifcModel && loader) {
                loader.ifcManager.removeSubset(ifcModel.modelID, undefined, 'selection-highlight');
            }
            return;
        }

        const expressIds = guids
            .map(guid => guidMap[guid])
            .filter((id): id is number => id !== undefined);

        if (expressIds.length > 0) {
            const highlightMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                depthTest: false,
                transparent: true,
                opacity: 0.6
            });

            loader.ifcManager.createSubset({
                modelID: ifcModel.modelID,
                ids: expressIds,
                material: highlightMaterial,
                removePrevious: true,
                customID: 'selection-highlight',
            });

            // Optional: Zoom to fit all elements
            const subset = loader.ifcManager.getSubset(ifcModel.modelID, 'selection-highlight');
            if (subset && cameraRef.current) {
                subset.geometry.computeBoundingBox();
                const box = subset.geometry.boundingBox;
                if (box) {
                    const center = new THREE.Vector3();
                    box.getCenter(center);
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const fov = cameraRef.current.fov * (Math.PI / 180);
                    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
                    cameraZ *= 2.5; // Zoom out a bit

                    cameraRef.current.position.set(center.x + cameraZ, center.y + cameraZ, center.z + cameraZ);
                    cameraRef.current.lookAt(center);
                }
            }
        }
    };

    const saveBookmark = () => {
        if (!controlsRef.current || !cameraRef.current) return;
        const name = prompt("Enter view name:", `View ${bookmarks.length + 1}`);
        if (!name) return;

        const newBookmark = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            position: cameraRef.current.position.clone(),
            target: controlsRef.current.target.clone()
        };
        setBookmarks([...bookmarks, newBookmark]);
    };

    const loadBookmark = (b: any) => {
        if (!controlsRef.current || !cameraRef.current) return;
        cameraRef.current.position.copy(b.position);
        controlsRef.current.target.copy(b.target);
        controlsRef.current.update();
    };

    return (
        <div className="relative w-full h-[80vh] border rounded-lg overflow-hidden bg-gray-50 flex">
            <div ref={containerRef} className="w-full h-full relative">
                {loadingProgress === 100 && (
                    <div className="flex flex-col gap-2 absolute top-4 right-4 z-10">
                        {/* Cycle 3 Bookmark Controls */}
                        <div className="bg-white/90 backdrop-blur p-2 rounded-xl border shadow-sm mb-2 space-y-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Spatial Bookmarks</p>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                                {bookmarks.map(b => (
                                    <button 
                                        key={b.id} 
                                        onClick={() => loadBookmark(b)}
                                        className="w-full text-left px-2 py-1.5 hover:bg-blue-50 text-[10px] font-bold text-slate-600 rounded-lg flex items-center gap-2"
                                    >
                                        <Eye className="w-3 h-3 text-blue-400" /> {b.name}
                                    </button>
                                ))}
                            </div>
                            <Button size="sm" variant="outline" className="w-full text-[10px] h-8" onClick={saveBookmark}>
                                <Plus className="w-3 h-3 mr-1" /> Save View
                            </Button>
                        </div>

                        <Button
                            size="sm"
                            onClick={() => setIsPanelOpen(true)}
                            disabled={isPanelOpen || is4DOpen || isCostOpen}
                        >
                            <ClipboardCheck className="w-4 h-4 mr-2" />
                            Smart Review
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setIs4DOpen(true)}
                            disabled={isPanelOpen || is4DOpen || isCostOpen}
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            4D Sim
                        </Button>
                        <Button
                            size="sm"
                            variant={isCostOpen ? "default" : "secondary"}
                            onClick={() => setIsCostOpen(true)}
                            disabled={isPanelOpen || is4DOpen || isCostOpen}
                        >
                            <DollarSign className="w-4 h-4 mr-2" />
                            5D Cost
                        </Button>
                    </div>
                )}

                {loadingProgress < 100 && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2 mx-auto"></div>
                            <p className="text-sm font-medium text-gray-600">Loading Model... {Math.round(loadingProgress)}%</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50/90 z-10">
                        <p className="text-red-500 font-medium">{error}</p>
                    </div>
                )}
            </div>

            <SmartReviewPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                ifcModel={ifcModel}
                projectId={projectId}
                fileId={fileId}
                onFocus={handleFocus}
            />

            <GanttPanel
                isOpen={is4DOpen}
                projectId={projectId}
                modelId={fileId}
                selectedElementId={selectedExpressId}
                selectedElementGuid={selectedGuid}
                tasks={tasks}
                onLinkCreated={() => simulationService.getLinks(projectId).then(setLinks)}
                onHighlightElements={handleHighlightGuids}
            />

            <CostPanel
                isOpen={isCostOpen}
                projectId={projectId}
                modelId={fileId}
                selectedElementGuid={selectedGuid}
                onMappingCreated={() => costService.getMappings(projectId).then(setCostMappings)}
                onHighlightElements={handleHighlightGuids}
            />

            {is4DOpen && (
                <TimeController
                    startDate={new Date('2024-01-01')}
                    endDate={new Date('2024-04-10')}
                    onTimeChange={setSimDate}
                />
            )}


            {(is4DOpen || isPanelOpen || isCostOpen) && (
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-80 z-30 bg-white"
                    onClick={() => { setIsPanelOpen(false); setIs4DOpen(false); setIsCostOpen(false); }}
                >
                    <Settings2 className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
