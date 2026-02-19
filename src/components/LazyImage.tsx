import React, { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    skeletonClassName?: string;
    animationDuration?: number;
}

export function LazyImage({
    src,
    alt,
    className = '',
    skeletonClassName = '',
    animationDuration = 300,
    ...rest
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = React.useRef<HTMLImageElement>(null);

    useEffect(() => {
        // Intersection Observer for detecting when image is in viewport
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (imgRef.current) {
                        observer.unobserve(imgRef.current);
                    }
                }
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {!isLoaded && (
                <Skeleton
                    className={`absolute inset-0 ${skeletonClassName}`}
                />
            )}
            <img
                ref={imgRef}
                src={isVisible ? src : undefined}
                alt={alt}
                loading="lazy"
                className={`transition-all w-full h-full ${isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${className}`}
                style={{
                    transitionDuration: `${animationDuration}ms`,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                }}
                onLoad={() => setIsLoaded(true)}
                onError={() => setIsLoaded(true)} // Handle error case
                {...rest}
            />
        </div>
    );
}
