/**
 * Help Center Page Component
 */
import React, { useState, useMemo } from 'react';
import {
    HELP_CATEGORIES,
    HELP_ARTICLES,
    searchArticles,
    getArticlesByCategory,
    HelpArticle,
    HelpCategory
} from './helpData';

interface HelpCenterProps {
    onArticleClick?: (article: HelpArticle) => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ onArticleClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

    const filteredArticles = useMemo(() => {
        if (searchQuery) {
            return searchArticles(searchQuery);
        }
        if (selectedCategory) {
            return getArticlesByCategory(selectedCategory);
        }
        return HELP_ARTICLES;
    }, [searchQuery, selectedCategory]);

    const handleArticleClick = (article: HelpArticle) => {
        setSelectedArticle(article);
        onArticleClick?.(article);
    };

    const handleBack = () => {
        setSelectedArticle(null);
    };

    // Article Detail View
    if (selectedArticle) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                >
                    ← Back to Help Center
                </button>

                <article className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {selectedArticle.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {HELP_CATEGORIES.find(c => c.id === selectedArticle.category)?.name}
                        </span>
                        <span>Updated: {selectedArticle.updatedAt}</span>
                    </div>

                    {selectedArticle.videoUrl && (
                        <div className="mb-8 aspect-video rounded-lg overflow-hidden bg-gray-100">
                            <iframe
                                src={selectedArticle.videoUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(selectedArticle.content) }}
                    />

                    <div className="mt-8 pt-6 border-t">
                        <p className="text-sm text-gray-500">
                            Tags: {selectedArticle.tags.map(tag => (
                                <span key={tag} className="inline-block mr-2 px-2 py-1 bg-gray-100 rounded text-gray-600">
                                    #{tag}
                                </span>
                            ))}
                        </p>
                    </div>
                </article>
            </div>
        );
    }

    // Main Help Center View
    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    📚 Help Center
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Find answers, tutorials, and guides to help you get the most out of Rukon CDE
                </p>

                {/* Search */}
                <div className="max-w-2xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search for help..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setSelectedCategory(null);
                        }}
                        className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">
                        🔍
                    </span>
                </div>
            </div>

            {/* Categories */}
            {!searchQuery && !selectedCategory && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                    {HELP_CATEGORIES.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-left"
                        >
                            <div className="text-3xl mb-2">{category.icon}</div>
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-500">{category.description}</p>
                        </button>
                    ))}
                </div>
            )}

            {/* Category Header */}
            {selectedCategory && (
                <div className="mb-6">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="text-blue-600 hover:text-blue-700 mb-2"
                    >
                        ← All Categories
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {HELP_CATEGORIES.find(c => c.id === selectedCategory)?.icon}{' '}
                        {HELP_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                    </h2>
                </div>
            )}

            {/* Search Results Header */}
            {searchQuery && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </h2>
                </div>
            )}

            {/* Articles List */}
            <div className="grid gap-4">
                {filteredArticles.map((article) => (
                    <button
                        key={article.id}
                        onClick={() => handleArticleClick(article)}
                        className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow text-left flex items-start gap-4"
                    >
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {article.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">
                                {article.content.substring(0, 150)}...
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                {article.videoUrl && (
                                    <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                                        📹 Video
                                    </span>
                                )}
                                <span className="text-xs text-gray-400">
                                    {HELP_CATEGORIES.find(c => c.id === article.category)?.name}
                                </span>
                            </div>
                        </div>
                        <span className="text-gray-400">→</span>
                    </button>
                ))}

                {filteredArticles.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <div className="text-4xl mb-4">🔍</div>
                        <p>No articles found. Try a different search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
    return markdown
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-5 mb-2">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mt-4 mb-2">$1</h3>')
        .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n\n/gim, '</p><p class="mb-3">')
        .replace(/^(.*)$/gim, '<p class="mb-3">$1</p>');
}

export default HelpCenter;
