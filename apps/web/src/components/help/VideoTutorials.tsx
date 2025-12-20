/**
 * Video Tutorial Card Component
 */
import React from 'react';

interface TutorialVideo {
    id: string;
    title: string;
    description: string;
    duration: string;
    thumbnailUrl: string;
    videoUrl: string;
    category: string;
}

export const TUTORIAL_VIDEOS: TutorialVideo[] = [
    {
        id: 'v1',
        title: 'Getting Started with Rukon CDE',
        description: 'A quick overview of the platform and how to set up your profile.',
        duration: '3:45',
        thumbnailUrl: '/thumbnails/getting-started.jpg',
        videoUrl: 'https://www.youtube.com/embed/getting-started',
        category: 'Getting Started',
    },
    {
        id: 'v2',
        title: 'Uploading Documents',
        description: 'Learn how to upload single files and bulk uploads.',
        duration: '2:30',
        thumbnailUrl: '/thumbnails/upload-docs.jpg',
        videoUrl: 'https://www.youtube.com/embed/upload-docs',
        category: 'Documents',
    },
    {
        id: 'v3',
        title: 'Setting Up Approval Workflows',
        description: 'Configure ISO 19650 compliant approval workflows.',
        duration: '4:15',
        thumbnailUrl: '/thumbnails/workflows.jpg',
        videoUrl: 'https://www.youtube.com/embed/workflows',
        category: 'Workflows',
    },
    {
        id: 'v4',
        title: 'Navigating the 3D Viewer',
        description: 'Master the 3D viewer controls and tools.',
        duration: '5:00',
        thumbnailUrl: '/thumbnails/3d-viewer.jpg',
        videoUrl: 'https://www.youtube.com/embed/3d-viewer',
        category: '3D Viewer',
    },
    {
        id: 'v5',
        title: 'Creating BCF Issues',
        description: 'Create and manage BCF issues for model coordination.',
        duration: '3:20',
        thumbnailUrl: '/thumbnails/bcf-issues.jpg',
        videoUrl: 'https://www.youtube.com/embed/bcf-issues',
        category: '3D Viewer',
    },
    {
        id: 'v6',
        title: 'Generating Reports',
        description: 'Create professional weekly and monthly reports.',
        duration: '4:00',
        thumbnailUrl: '/thumbnails/reports.jpg',
        videoUrl: 'https://www.youtube.com/embed/reports',
        category: 'Reports',
    },
    {
        id: 'v7',
        title: 'HSE Incident Reporting',
        description: 'Log and track safety incidents on your project.',
        duration: '3:30',
        thumbnailUrl: '/thumbnails/hse.jpg',
        videoUrl: 'https://www.youtube.com/embed/hse',
        category: 'HSE',
    },
    {
        id: 'v8',
        title: 'Using the AI Assistant',
        description: 'Ask questions and get answers from your documents.',
        duration: '2:45',
        thumbnailUrl: '/thumbnails/ai-assistant.jpg',
        videoUrl: 'https://www.youtube.com/embed/ai-assistant',
        category: 'AI',
    },
];

interface VideoCardProps {
    video: TutorialVideo;
    onClick: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow text-left w-full"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600">
                    <span className="text-4xl">▶️</span>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                    {video.duration}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <span className="text-xs text-blue-600 font-medium">{video.category}</span>
                <h3 className="font-semibold text-gray-900 mt-1">{video.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.description}</p>
            </div>
        </button>
    );
};

interface VideoPlayerModalProps {
    video: TutorialVideo | null;
    onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
    if (!video) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80" onClick={onClose} />
            <div className="relative bg-white rounded-xl overflow-hidden max-w-4xl w-full mx-4">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full hover:bg-black/70"
                >
                    ✕
                </button>
                <div className="aspect-video">
                    <iframe
                        src={video.videoUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900">{video.title}</h2>
                    <p className="text-gray-600 mt-2">{video.description}</p>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
