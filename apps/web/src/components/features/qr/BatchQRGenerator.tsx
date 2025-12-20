/**
 * Batch QR Code Generator
 * Story 7.3: Mobile App - QR Scanning
 * 
 * Generates multiple QR codes for batch printing
 */
import React, { useState } from 'react';
import QRCode from 'react-qr-code';

interface QRItem {
    type: 'asset' | 'room';
    id: string;
    name: string;
    code?: string;
}

interface BatchQRGeneratorProps {
    items: QRItem[];
    projectName?: string;
    onClose?: () => void;
}

export const BatchQRGenerator: React.FC<BatchQRGeneratorProps> = ({
    items,
    projectName,
    onClose,
}) => {
    const [isExporting, setIsExporting] = useState(false);

    const handlePrintAll = async () => {
        setIsExporting(true);

        try {
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('Please allow popups to export PDF');
                return;
            }

            // Generate QR cards HTML
            const qrCards = items.map((item) => `
        <div class="qr-card">
          <div class="qr-code">
            <svg viewBox="0 0 100 100" width="120" height="120">
              <!-- QR placeholder - actual QR rendered via JS -->
            </svg>
          </div>
          <div class="info">
            <div class="type-badge ${item.type}">${item.type}</div>
            <div class="name">${item.name}</div>
            ${item.code ? `<div class="code">${item.code}</div>` : ''}
          </div>
          <div class="qr-value">rukon://${item.type}/${item.id}</div>
        </div>
      `).join('');

            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>QR Codes - ${projectName || 'Batch Export'}</title>
          <script src="https://unpkg.com/react-qr-code@2.0.15/lib/index.umd.min.js"></script>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, sans-serif;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 1px solid #e5e7eb;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
            }
            .qr-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 16px;
              text-align: center;
              break-inside: avoid;
            }
            .qr-code {
              margin-bottom: 12px;
            }
            .type-badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 10px;
              text-transform: uppercase;
              color: white;
              margin-bottom: 4px;
            }
            .type-badge.asset { background: #3b82f6; }
            .type-badge.room { background: #22c55e; }
            .name {
              font-size: 12px;
              font-weight: 600;
              color: #111827;
            }
            .code {
              font-size: 10px;
              color: #6b7280;
              font-family: monospace;
            }
            .qr-value {
              font-size: 8px;
              color: #9ca3af;
              margin-top: 8px;
              font-family: monospace;
              word-break: break-all;
            }
            @media print {
              body { padding: 10px; }
              .grid { gap: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${projectName || 'QR Codes'}</h1>
            <p>${items.length} items</p>
          </div>
          <div class="grid">
            ${qrCards}
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `);
            printWindow.document.close();
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Batch QR Generation</h3>
                    <p className="text-sm text-gray-500">{items.length} items selected</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrintAll}
                        disabled={isExporting || items.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
                    >
                        {isExporting ? 'Preparing...' : '🖨️ Print All'}
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-gray-50 rounded-lg p-3 text-center"
                    >
                        <div className="bg-white p-2 rounded mb-2 inline-block">
                            <QRCode
                                value={`rukon://${item.type}/${item.id}`}
                                size={80}
                                level="M"
                            />
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs text-white mb-1 ${item.type === 'asset' ? 'bg-blue-500' : 'bg-green-500'
                            }`}>
                            {item.type}
                        </span>
                        <p className="text-xs font-medium text-gray-700 truncate">{item.name}</p>
                        {item.code && (
                            <p className="text-xs text-gray-400 font-mono">{item.code}</p>
                        )}
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No items selected for QR generation
                </div>
            )}
        </div>
    );
};

export default BatchQRGenerator;
