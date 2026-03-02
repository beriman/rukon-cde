'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
// @ts-ignore - Three.js examples types not available for this version
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SmartReviewPanel } from './SmartReviewPanel';
import { Button } from '../ui/button';
import { ClipboardCheck, Clock, Settings2, DollarSign, Package, Eye, Plus, AlertCircle, MapPin } from 'lucide-react';
import type { IFCModel } from 'web-ifc-three/IFC/components/IFCModel';
import { TimeController } from './TimeController';
import { GanttPanel } from './GanttPanel';
import { simulationService, SimulationLink } from '@/lib/api/simulation.service';
import { scheduleService, ScheduleTask } from '@/lib/api/schedule.service';
import { CostPanel } from './CostPanel';
import { costService, CostMapping } from '@/lib/api/cost.service';
import { AssetPanel } from './AssetPanel';

interface IfcViewerProps {
    modelUrls: string[];
    projectId: string;
    fileId: string;
}

export function IfcViewer({ modelUrls, projectId, fileId }: IfcViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // State for Panels & Modes
    const [ifcModels, setIfcModels] = useState<IFCModel[]>([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [is4DOpen, setIs4DOpen] = useState(false);
    const [isCostOpen, setIsCostOpen] = useState(false);
    const [isAssetOpen, setIsAssetOpen] = useState(false);
    const [isIssueMode, setIsIssueMode] = useState(false);
    
    // States for data
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [simDate, setSimDate] = useState<Date>(new Date('2024-01-01'));
    const [links, setLinks] = useState<SimulationLink[]>([]);
    const [tasks, setTasks] = useState<ScheduleTask[]>([]);
    const [costMappings, setCostMappings] = useState<CostMapping[]>([]);
    const [guidMap, setGuidMap] = useState<Record<string, number>>({});

    // Selection State
    const [selectedGuid, setSelectedGuid] = useState<string | null>(null);
    const [selectedExpressId, setSelectedExpressId] = useState<number | null>(null);

    // Refs
    const ifcLoaderRef = useRef<IFCLoader | null>(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<any>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);

    useEffect(() => {
        if (!containerRef.current || !modelUrls || modelUrls.length === 0) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.background = new THREE.Color(0xf0f2f5);

        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(15, 15, 15);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.localClippingEnabled = true;
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controlsRef.current = controls;

        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(10, 25, 10);
        scene.add(dirLight);
        scene.add(new THREE.GridHelper(50, 50, 0xdddddd, 0xeeeeee));

        const ifcLoader = new IFCLoader();
        ifcLoaderRef.current = ifcLoader;
        ifcLoader.ifcManager.setWasmPath('/wasm/');

        // Federation Loading
        const loadedModels: IFCModel[] = [];
        let totalFiles = modelUrls.length;
        let filesLoaded = 0;

        const loadNext = (index: number) => {
            if (index >= totalFiles) {
                setIfcModels(loadedModels);
                setLoadingProgress(100);
                initializeGuidMapping(ifcLoader, loadedModels);
                return;
            }

            ifcLoader.load(modelUrls[index], (model) => {
                scene.add(model);
                loadedModels.push(model as unknown as IFCModel);
                filesLoaded++;
                setLoadingProgress((filesLoaded / totalFiles) * 100);
                loadNext(index + 1);
            }, (progress) => {
                const partial = (progress.loaded / (progress.total || 1)) / totalFiles;
                setLoadingProgress(Math.min((filesLoaded / totalFiles + partial) * 100, 99));
            }, (err) => {
                console.error("Error loading IFC", modelUrls[index], err);
                loadNext(index + 1);
            });
        };

        loadNext(0);

        async function initializeGuidMapping(loader: IFCLoader, models: IFCModel[]) {
            const newGuidMap: Record<string, number> = {};
            for (const model of models) {
                try {
                    // @ts-ignore
                    const allItemIds = await loader.ifcManager.getAllItems(model.modelID);
                    for (const id of allItemIds) {
                        const props = await loader.ifcManager.getItemProperties(model.modelID, id);
                        if (props.GlobalId?.value) newGuidMap[props.GlobalId.value] = id;
                    }
                } catch(e) {}
            }
            setGuidMap(newGuidMap);
        }

        const mouse = new THREE.Vector2();
        const handleClick = async (event: MouseEvent) => {
            const loader = ifcLoaderRef.current;
            if (!loader || loadedModels.length === 0) return;

            const bounds = container.getBoundingClientRect();
            mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
            mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

            raycasterRef.current.setFromCamera(mouse, camera);
            const intersects = raycasterRef.current.intersectObjects(loadedModels as any[]);
            
            if (intersects.length > 0) {
                const intersection = intersects[0];
                const intersectedModel = intersection.object as unknown as IFCModel;

                if (isIssueMode) {
                    // --- 3D ISSUE PINNING ---
                    const pinPoint = intersection.point;
                    const pinGeom = new THREE.SphereGeometry(0.2, 16, 16);
                    const pinMat = new THREE.MeshBasicMaterial({ color: 0xff0000, depthTest: false });
                    const pinMesh = new THREE.Mesh(pinGeom, pinMat);
                    pinMesh.position.copy(pinPoint);
                    pinMesh.renderOrder = 999;
                    scene.add(pinMesh);

                    const title = prompt("New Issue at this location:", "Coordinate Check");
                    if (title) {
                        console.log(`Issue Created: ${title} at`, pinPoint);
                        // Future: API call to save BCF topic with pinPoint
                    } else {
                        scene.remove(pinMesh);
                    }
                    setIsIssueMode(false);
                    return;
                }

                const id = loader.ifcManager.getExpressId(intersectedModel.geometry, intersection.faceIndex!);
                setSelectedExpressId(id);

                const mat = new THREE.MeshBasicMaterial({ color: 0xffe600, depthTest: false, transparent: true, opacity: 0.6 });
                loader.ifcManager.createSubset({ modelID: intersectedModel.modelID, ids: [id], material: mat, removePrevious: true, customID: 'selection-highlight' });

                const props = await loader.ifcManager.getItemProperties(intersectedModel.modelID, id);
                if (props.GlobalId?.value) setSelectedGuid(props.GlobalId.value);
            } else {
                setSelectedExpressId(null); setSelectedGuid(null);
                loadedModels.forEach(m => loader.ifcManager.removeSubset(m.modelID, undefined, 'selection-highlight'));
            }
        };

        container.addEventListener('click', handleClick);
        let animationId: number;
        const animate = () => { animationId = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); };
        animate();

        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (container) { container.removeEventListener('click', handleClick); container.removeChild(renderer.domElement); }
            renderer.dispose(); cancelAnimationFrame(animationId);
        };
    }, [modelUrls, isIssueMode]); // Re-run effect when mode changes to update click handler

    // Logic for 4D/5D sync
    useEffect(() => {
        if (is4DOpen && projectId) simulationService.getLinks(projectId).then(setLinks);
        if (isCostOpen && projectId) costService.getMappings(projectId).then(setCostMappings);
    }, [is4DOpen, isCostOpen, projectId]);

    const handleFocus = async (expressId: number) => {
        const loader = ifcLoaderRef.current;
        const camera = cameraRef.current;
        if (ifcModels.length === 0 || !loader || !camera) return;

        for (const model of ifcModels) {
            try {
                loader.ifcManager.createSubset({
                    modelID: model.modelID, ids: [expressId],
                    material: new THREE.MeshBasicMaterial({ color: 0x00ffff, depthTest: false, transparent: true, opacity: 0.6 }),
                    removePrevious: true, customID: 'selection-highlight',
                });

                // @ts-ignore
                const subset = loader.ifcManager.getSubset(model.modelID, 'selection-highlight');
                if (subset) {
                    subset.geometry.computeBoundingBox();
                    const box = subset.geometry.boundingBox;
                    if (box) {
                        const center = new THREE.Vector3(); box.getCenter(center);
                        const distance = box.getSize(new THREE.Vector3()).length() * 2;
                        const direction = camera.position.clone().sub(center).normalize();
                        camera.position.copy(center.clone().add(direction.multiplyScalar(distance || 5)));
                        camera.lookAt(center);
                        setSelectedExpressId(expressId);
                        const props = await loader.ifcManager.getItemProperties(model.modelID, expressId);
                        if (props.GlobalId?.value) setSelectedGuid(props.GlobalId.value);
                        break;
                    }
                }
            } catch(e) {}
        }
    };

    const handleHighlightGuids = (guids: string[]) => {
        const loader = ifcLoaderRef.current;
        if (ifcModels.length === 0 || !loader || guids.length === 0) return;
        const ids = guids.map(g => guidMap[g]).filter((id): id is number => id !== undefined);
        if (ids.length > 0) {
            const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff, depthTest: false, transparent: true, opacity: 0.6 });
            ifcModels.forEach(m => loader.ifcManager.createSubset({ modelID: m.modelID, ids, material: mat, removePrevious: true, customID: 'selection-highlight' }));
        }
    };

    const saveBookmark = () => {
        if (!controlsRef.current || !cameraRef.current) return;
        const name = prompt("View name:");
        if (name) setBookmarks([...bookmarks, { id: Math.random().toString(36).substr(2,9), name, pos: cameraRef.current.position.clone(), target: controlsRef.current.target.clone() }]);
    };

    const loadBookmark = (b: any) => {
        if (!controlsRef.current || !cameraRef.current) return;
        cameraRef.current.position.copy(b.pos); controlsRef.current.target.copy(b.target); controlsRef.current.update();
    };

    return (
        <div className="relative w-full h-[80vh] border rounded-lg overflow-hidden bg-gray-50 flex">
            <div ref={containerRef} className="w-full h-full relative">
                {isIssueMode && (
                    <div className="absolute inset-0 pointer-events-none border-4 border-red-500/40 z-20 flex items-center justify-center">
                        <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-2xl flex items-center gap-2 animate-bounce">
                            <MapPin className="w-5 h-5" /> Click model to drop Issue Pin
                        </div>
                    </div>
                )}

                {loadingProgress === 100 && (
                    <div className="flex flex-col gap-2 absolute top-4 right-4 z-10">
                        <div className="bg-white/90 backdrop-blur p-2 rounded-xl border shadow-sm mb-2 space-y-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Views</p>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                                {bookmarks.map(b => (
                                    <button key={b.id} onClick={() => loadBookmark(b)} className="w-full text-left px-2 py-1 hover:bg-blue-50 text-[10px] font-bold text-slate-600 rounded flex items-center gap-2">
                                        <Eye className="w-3 h-3 text-blue-400" /> {b.name}
                                    </button>
                                ))}
                            </div>
                            <Button size="sm" variant="outline" className="w-full text-[10px] h-7" onClick={saveBookmark}><Plus className="w-3 h-3 mr-1" /> Save</Button>
                        </div>

                        <Button size="sm" variant={isIssueMode ? "destructive" : "secondary"} onClick={() => setIsIssueMode(!isIssueMode)}>
                            <AlertCircle className="w-4 h-4 mr-2" /> {isIssueMode ? "Cancel" : "Pin Issue"}
                        </Button>
                        <Button size="sm" onClick={() => setIsPanelOpen(true)} disabled={isPanelOpen || is4DOpen || isCostOpen || isAssetOpen}><ClipboardCheck className="w-4 h-4 mr-2" /> Review</Button>
                        <Button size="sm" variant="secondary" onClick={() => setIs4DOpen(true)} disabled={isPanelOpen || is4DOpen || isCostOpen || isAssetOpen}><Clock className="w-4 h-4 mr-2" /> 4D Sim</Button>
                        <Button size="sm" variant={isCostOpen ? "default" : "secondary"} onClick={() => setIsCostOpen(true)} disabled={isPanelOpen || is4DOpen || isCostOpen || isAssetOpen}><DollarSign className="w-4 h-4 mr-2" /> 5D Cost</Button>
                        <Button size="sm" variant={isAssetOpen ? "default" : "secondary"} onClick={() => setIsAssetOpen(true)} disabled={isPanelOpen || is4DOpen || isCostOpen || isAssetOpen}><Package className="w-4 h-4 mr-2" /> Assets</Button>
                    </div>
                )}

                {loadingProgress < 100 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2 mx-auto"></div>
                            <p className="text-sm font-medium text-gray-600">Syncing Federation... {Math.round(loadingProgress)}%</p>
                        </div>
                    </div>
                )}
            </div>

            <SmartReviewPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} ifcModel={ifcModels[0]} projectId={projectId} fileId={fileId} onFocus={handleFocus} />
            <AssetPanel projectId={projectId} elementGuid={selectedGuid} isOpen={isAssetOpen} />
            <GanttPanel isOpen={is4DOpen} projectId={projectId} modelId={fileId} selectedElementId={selectedExpressId} selectedElementGuid={selectedGuid} tasks={tasks} onLinkCreated={() => simulationService.getLinks(projectId).then(setLinks)} onHighlightElements={handleHighlightGuids} />
            <CostPanel isOpen={isCostOpen} projectId={projectId} modelId={fileId} selectedElementGuid={selectedGuid} onMappingCreated={() => costService.getMappings(projectId).then(setCostMappings)} onHighlightElements={handleHighlightGuids} />

            {is4DOpen && <TimeController startDate={new Date('2024-01-01')} endDate={new Date('2024-04-10')} onTimeChange={setSimDate} />}

            {(is4DOpen || isPanelOpen || isCostOpen || isAssetOpen) && (
                <Button variant="outline" size="icon" className="absolute top-4 right-80 z-30 bg-white" onClick={() => { setIsPanelOpen(false); setIs4DOpen(false); setIsCostOpen(false); setIsAssetOpen(false); }}>
                    <Settings2 className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
