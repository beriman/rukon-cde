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
    Color,
    MeshBasicMaterial,
    DoubleSide
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { apiClient } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

interface ModelCompareViewerProps {
    fileId: string;
    versionA: number;
    versionB: number;
}

export function ModelCompareViewer({ fileId, versionA, versionB }: ModelCompareViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!containerRef.current || !fileId) return;

        const container = containerRef.current;

        // Scene Setup
        const scene = new Scene();
        scene.background = new Color(0x111111); // Dark bg for diff

        // Camera
        const camera = new PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(10, 10, 10);

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
        scene.add(new GridHelper(50, 50));

        // Load Models
        const loader = new IFCLoader();
        loader.ifcManager.setWasmPath('/wasm/');

        const loadModels = async () => {
            try {
                // Get URLs
                const { data: dataA } = await apiClient.get(`/files/${fileId}/download?version=${versionA}`);
                const { data: dataB } = await apiClient.get(`/files/${fileId}/download?version=${versionB}`);

                // Materials for Diff
                const matA = new MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3, side: DoubleSide, depthTest: false });
                const matB = new MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3, side: DoubleSide, depthTest: false });

                const loadModel = (url: string) => new Promise<any>((resolve, reject) => {
                    loader.load(url, resolve, undefined, reject);
                });

                const p1 = loadModel(dataA.url).then((model: any) => {
                    model.traverse((child: any) => {
                        if (child.isMesh) child.material = matA;
                    });
                    scene.add(model);
                });

                const p2 = loadModel(dataB.url).then((model: any) => {
                    model.traverse((child: any) => {
                        if (child.isMesh) child.material = matB;
                    });
                    scene.add(model);
                });

                await Promise.all([p1, p2]);
                setIsLoading(false);

            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        loadModels();

        // Loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            container.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [fileId, versionA, versionB]);

    return (
        <div className="w-full h-full relative">
            <div ref={containerRef} className="w-full h-full" />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                    <Loader2 className="animate-spin mr-2" /> Diffing Models...
                </div>
            )}
        </div>
    );
}
