import React from "react";

const AssetSummary = ({ assets = [] }) => {
    if (!Array.isArray(assets)) {
        console.error("AssetSummary: assets is not an array", assets);
        return <p className="text-red-500">Error: Asset data is invalid.</p>;
    }

    const maxAssets = 6; // total of 2 columns * 3 assets = 6 max
    const limitedAssets = assets.slice(0, maxAssets);

    const column1 = limitedAssets.slice(0, 3);
    const column2 = limitedAssets.slice(3, 6);

    return (
        <div className="p-4 rounded-lg shadow-md bg-[#f2ebc6] dark:bg-slate-800 transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Asset Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[column1, column2].map((column, colIndex) => (
                    <ul key={colIndex} className="space-y-4">
                        {column.map((asset) => (
                            <li
                                key={asset.asset_id}
                                className="flex justify-between items-center bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm"
                            >
                                <div>
                                    <h3 className="font-medium text-gray-700 dark:text-gray-200">{asset.asset_name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Min Balance: ${Number(asset.minimum_balance).toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-right text-blue-700 dark:text-blue-300 font-semibold text-lg">
                                    ${Number(asset.current_balance).toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </div>
    );
};

export default AssetSummary;
