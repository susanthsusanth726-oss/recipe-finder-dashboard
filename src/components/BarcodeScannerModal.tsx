import React, { useState } from 'react';
import { X, QrCode, Camera, Check, Plus, ShoppingBag } from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';

interface BarcodeScannerModalProps {
  onClose: () => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onClose }) => {
  const { addCustomShoppingItem, showToast } = useRecipeContext();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<{ name: string; category: any } | null>(null);

  const sampleProducts = [
    { name: 'Organic Greek Yogurt 500g', category: 'Dairy & Eggs' },
    { name: 'Wild Norwegian Salmon 400g', category: 'Meat & Seafood' },
    { name: 'Hass Avocados (3 pack)', category: 'Produce' },
    { name: 'Extra Virgin Olive Oil 750ml', category: 'Pantry & Grains' },
  ];

  const handleSimulateScan = (prod: { name: string; category: any }) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedProduct(prod);
      showToast(`Scanned product: ${prod.name}! 📷`, 'success');
    }, 1200);
  };

  const handleAddScannedToShopping = () => {
    if (scannedProduct) {
      addCustomShoppingItem(scannedProduct.name, '1 item', scannedProduct.category);
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#0B1121] border border-white/10 rounded-[32px] p-6 shadow-2xl relative space-y-5"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-400/30">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif italic text-white">Grocery Barcode Scanner</h3>
            <p className="text-xs text-slate-400">Scan product barcodes to quickly add items</p>
          </div>
        </div>

        {/* Camera View Finder Simulation */}
        <div className="relative h-48 w-full rounded-2xl bg-white/5 border-2 border-dashed border-purple-500/40 flex flex-col items-center justify-center p-4 overflow-hidden">
          {isScanning ? (
            <div className="text-center space-y-2">
              <Camera className="w-8 h-8 text-purple-400 animate-bounce mx-auto" />
              <p className="text-xs font-bold text-purple-300">Scanning Barcode...</p>
            </div>
          ) : scannedProduct ? (
            <div className="text-center space-y-2">
              <Check className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-serif italic text-white">{scannedProduct.name}</p>
              <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 font-bold uppercase tracking-widest">
                {scannedProduct.category}
              </span>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <Camera className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">Position product barcode in front of camera</p>
            </div>
          )}
        </div>

        {/* Preset Sample Barcodes for Testing */}
        <div>
          <p className="text-xs font-bold text-slate-400 mb-2">Simulate scanning an item:</p>
          <div className="space-y-2">
            {sampleProducts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulateScan(p)}
                className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-purple-600/20 border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-between"
              >
                <span>{p.name}</span>
                <QrCode className="w-3.5 h-3.5 text-purple-400" />
              </button>
            ))}
          </div>
        </div>

        {scannedProduct && (
          <button
            onClick={handleAddScannedToShopping}
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40 border border-purple-400/30 flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Shopping List</span>
          </button>
        )}
      </div>
    </div>
  );
};
