'use client';

import { useEffect, useRef, useState } from 'react';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
import {
    AmbientLight,
    DirectionalLight,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    GridHelper,
    Color
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { apiClient } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

interface ModelViewerProps {
    fileId: string;
}

export function ModelViewer({ fileId }: ModelViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        if (!containerRef.current || !fileId) return;

        const container = containerRef.current;

        // Scene Setup
        const scene = new Scene();
        scene.background = new Color(0xf1f5f9); // Slate-100 equivalent

        // Camera
        const camera = new PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 10;
        camera.position.y = 10;
        camera.position.x = 10;

        // Renderer
        const renderer = new WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Lights
        const ambientLight = new AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        scene.add(directionalLight);

        // Grid
        const grid = new GridHelper(50, 50);
        scene.add(grid);

        // Load Model
        const loader = new IFCLoader();

        // Configure wasm path - normally copied to public during build
        // For this environment, we assume standard nextjs public folder mapping
        loader.ifcManager.setWasmPath('/wasm/');

        const loadModel = async () => {
            try {
                // Get presigned URL
                const { data } = await apiClient.get(`/files/${fileId}/download`);
                const url = data.url;

                await loader.loadAsync(url, (event) => {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setLoadingProgress(progress);
                }).then((model) => {
                    scene.add(model);
                    setIsLoading(false);
                });

            } catch (error) {
                console.error("Error loading model:", error);
                setIsLoading(false);
                // Handle error UI
            }
        };

        loadModel();

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            container.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [fileId]);

    return (
        <div className="w-full h-full relative">
            <div ref={containerRef} className="w-full h-full" />

            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 z-20">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
                    <p className="text-slate-600 font-medium">Loading 3D Model...</p>
                    <p className="text-slate-500 text-sm mt-1">{loadingProgress}%</p>
                </div>
            )}
        </div>
    );
}
