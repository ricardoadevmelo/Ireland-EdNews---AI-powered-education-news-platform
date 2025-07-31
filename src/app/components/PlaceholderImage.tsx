import React from 'react';

const PlaceholderImage: React.FC<{ 
  width?: number; 
  height?: number; 
  text?: string;
  className?: string;
}> = ({ 
  width = 400, 
  height = 300, 
  text = "🇮🇪 Ireland EdNews",
  className = ""
}) => {
  return (
    <div 
      className={`bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 font-semibold ${className}`}
      style={{ width, height, minHeight: height }}
    >
      <div className="text-center">
        <div className="text-3xl mb-2">📚</div>
        <div className="text-sm">{text}</div>
      </div>
    </div>
  );
};

export default PlaceholderImage;
