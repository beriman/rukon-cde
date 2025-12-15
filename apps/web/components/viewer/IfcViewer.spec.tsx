import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IfcViewer } from './IfcViewer';

// Mock Three.js and web-ifc-three
vi.mock('three', () => {
    return {
        Scene: class {
            add = vi.fn();
            background = null;
        },
        PerspectiveCamera: class {
            position = { x: 0, y: 0, z: 0, set: vi.fn() };
            updateProjectionMatrix = vi.fn();
        },
        WebGLRenderer: class {
            setSize = vi.fn();
            render = vi.fn();
            domElement = document.createElement('canvas');
            dispose = vi.fn();
            constructor() { }
        },
        Color: class { },
        AmbientLight: class { },
        DirectionalLight: class {
            position = { set: vi.fn() };
        },
        GridHelper: class { },
        Vector3: class { },
    };
});

vi.mock('three/examples/jsm/controls/OrbitControls', () => {
    return {
        OrbitControls: class {
            enableDamping = true;
            update = vi.fn();
            constructor() { }
        }
    };
});

vi.mock('web-ifc-three/IFCLoader', () => {
    return {
        IFCLoader: class {
            ifcManager = { setWasmPath: vi.fn() };
            load = vi.fn();
        }
    };
});

describe('IfcViewer', () => {
    it('renders loading state initially', () => {
        render(<IfcViewer modelUrl="http://example.com/model.ifc" />);
        expect(screen.getByText(/Loading Model/)).toBeInTheDocument();
    });
});
