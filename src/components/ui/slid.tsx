import React, { useState } from "react";

interface SliderProps {
    images: string[];
}

const SimpleSlider: React.FC<SliderProps> = ({ images }) => {
    const [current, setCurrent] = useState(0);

    if (!images || images.length === 0) return null;

    const nextSlide = () => {
        setCurrent(current === images.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? images.length - 1 : current - 1);
    };

    const arrowStyle: React.CSSProperties = {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        background: "rgba(0,0,0,0.3)",
        border: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background 0.3s",
    };

    const arrowHoverStyle: React.CSSProperties = {
        background: "rgba(0,0,0,0.5)",
    };

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                maxWidth: "600px",
                height: "450px",
                margin: "auto",
                overflow: "hidden",
                borderRadius: "8px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    width: `${images.length * 100}%`,
                    transform: `translateX(-${(100 / images.length) * current}%)`,
                    transition: "transform 0.5s ease-in-out",
                    height: "100%",
                }}
            >
                {images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`slide-${idx}`}
                        style={{
                            width: `${100 / images.length}%`,
                            height: "100%",
                            objectFit: "cover",
                            flexShrink: 0,
                        }}
                    />
                ))}
            </div>

            {/* Left Arrow */}
            <button
                onClick={prevSlide}
                style={{ ...arrowStyle, left: 10 }}
                onMouseOver={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.3)")}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth={3}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            {/* Right Arrow */}
            <button
                onClick={nextSlide}
                style={{ ...arrowStyle, right: 10 }}
                onMouseOver={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.3)")}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth={3}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
            </button>

            {/* Dots */}
            <div
                style={{
                    textAlign: "center",
                    position: "absolute",
                    bottom: 10,
                    width: "100%",
                    zIndex: 2,
                }}
            >
                {images.map((_, idx) => (
                    <span
                        key={idx}
                        style={{
                            display: "inline-block",
                            width: "12px",
                            height: "12px",
                            margin: "0 6px",
                            borderRadius: "50%",
                            background: idx === current ? "black" : "rgba(0,0,0,0.3)",
                            cursor: "pointer",
                        }}
                        onClick={() => setCurrent(idx)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SimpleSlider;
