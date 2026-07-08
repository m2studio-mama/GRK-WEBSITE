import React, { useState, useEffect } from 'react';

const OdometerDigit = ({ digit }) => {
  const num = parseInt(digit, 10);
  const targetOffset = isNaN(num) ? 0 : num * 10;

  return (
    <div className="relative h-10 w-5 text-center overflow-hidden inline-block font-black">
      <div 
        className="absolute w-full transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(-${targetOffset}%)`, top: 0, left: 0 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-10 flex items-center justify-center">
            {n}
          </div>
        ))}
      </div>
    </div>
  );
};

const Odometer = ({ value, suffix = "" }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const end = parseInt(value, 10);
    if (isNaN(end)) return;
    
    // Simulate count trigger
    const timeout = setTimeout(() => {
      setCurrentValue(end);
    }, 100);

    return () => clearTimeout(timeout);
  }, [value]);

  const digits = currentValue.toString().split('');

  return (
    <div className="inline-flex items-center text-3xl sm:text-4xl font-black text-primary text-glow-gold tracking-tight select-none">
      {digits.map((d, idx) => (
        <OdometerDigit key={idx} digit={d} />
      ))}
      <span className="ml-0.5">{suffix}</span>
    </div>
  );
};

export default Odometer;
