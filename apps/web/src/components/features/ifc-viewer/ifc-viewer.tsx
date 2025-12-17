"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface IfcViewerProps {
    className?: string;
    onSelect?: (elementId: string | null) => void;
    highlightedElements?: Map<string, 'HIDDEN' | 'IN_PROGRESS' | 'COMPLETED'>;
}

export interface IfcViewerRef {
    loadInfo: (url: string) => void;
}

const IfcViewer = forwardRef<IfcViewerRef, IfcViewerProps>(({ className, onSelect, highlightedElements }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Three.js Refs to keep them persistent without re-renders
    const viewerRef = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        controls: OrbitControls;
        ifcLoader: IFCLoader;
        raycaster: THREE.Raycaster;
        mouse: THREE.Vector2;
        models: any[];
    } | null>(null);

    // Initialize Viewer
    useEffect(() => {
        if (!containerRef.current || viewerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f172a); // Slate-950 matches UI

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(-10, -5, -5);
        scene.add(directionalLight2);

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 0, 0);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // IFC Loader
        const ifcLoader = new IFCLoader();
        ifcLoader.ifcManager.setWasmPath("/wasm/"); // Expects web-ifc.wasm here

        const raycaster = new THREE.Raycaster();
        // raycaster.firstHitOnly = true; // Not available in standard three.js
        const mouse = new THREE.Vector2();

        viewerRef.current = {
            scene,
            camera,
            renderer,
            controls,
            ifcLoader,
            raycaster,
            mouse,
            models: []
        };

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            // Basic Cleanup (production would need more robust disposal)
            renderer.dispose();
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current || !viewerRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            viewerRef.current.camera.aspect = width / height;
            viewerRef.current.camera.updateProjectionMatrix();
            viewerRef.current.renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load Model Handler
    useImperativeHandle(ref, () => ({
        loadInfo: async (url: string) => {
            if (!viewerRef.current) return;
            setIsLoading(true);
            setProgress(0);

            try {
                // Clear existing
                // viewerRef.current.models.forEach(m => viewerRef.current!.scene.remove(m));

                // Load new
                // For now, load a demo file or the provided URL
                // In a real implementation this would fetch from the API/S3
                // using the ifcLoader
                const model = await viewerRef.current.ifcLoader.loadAsync(url, (event) => {
                    const percent = (event.loaded / event.total) * 100;
                    setProgress(percent);
                });

                viewerRef.current.scene.add(model);
                viewerRef.current.models.push(model);

                // Fit to screen (simplified)
                viewerRef.current.camera.position.set(20, 20, 20);
                viewerRef.current.controls.target.set(0, 0, 0);

            } catch (err) {
                console.error("Error loading IFC:", err);
            } finally {
                setIsLoading(false);
            }
        }
    }));

    // Highlight / Visibility Updates (4D Simulation)
    useEffect(() => {
        if (!viewerRef.current || !highlightedElements || viewerRef.current.models.length === 0) return;

        const manager = viewerRef.current.ifcLoader.ifcManager;
        const modelID = 0; // Assuming single model for MVP

        // This requires subset or material manipulation logic
        // For MVP we might just log or try basic color change if IDs map correctly
        // Implementing full subset creation is heavy, so pseudo-code for now:

        // 1. Reset all to default opacity/color
        // 2. Loop highlightedElements
        // 3. Apply color: Green (Completed), Yellow (In Progress), Transparent (Hidden)

    }, [highlightedElements]);

    // Click Selection
    const handlePointerDown = (event: React.MouseEvent) => {
        if (!viewerRef.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        viewerRef.current.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        viewerRef.current.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        viewerRef.current.raycaster.setFromCamera(viewerRef.current.mouse, viewerRef.current.camera);

        const intersects = viewerRef.current.raycaster.intersectObjects(viewerRef.current.models);
        if (intersects.length > 0) {
            const faceIndex = intersects[0].faceIndex;
            // Need ifcManager to get Express ID from face index
            // const expressID = manager.getExpressId(geometry, faceIndex);
            // onSelect(expressID);
            console.log("Clicked object", intersects[0]);
            onSelect?.("test-guid-123"); // Mock return
        } else {
            onSelect?.(null);
        }
    };

    return (
        <div className={cn("relative w-full h-full overflow-hidden", className)}>
            <div
                ref={containerRef}
                className="w-full h-full cursor-crosshair"
                onMouseDown={handlePointerDown}
            />

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white z-20">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                        <span>Loading Model... {Math.round(progress)}%</span>
                    </div>
                </div>
            )}

            {/* Grid/Axes Helper Overlay for Debug */}
            <div className="absolute bottom-4 right-4 text-xs text-slate-500 pointer-events-none">
                WEB-IFC-THREE Engine Ready
            </div>
        </div>
    );
});

IfcViewer.displayName = "IfcViewer";

export { IfcViewer };
