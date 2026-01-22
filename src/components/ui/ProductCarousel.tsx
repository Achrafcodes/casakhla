import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCarouselProps {
    images: string[];
    productTitle: string;
}

export function ProductCarousel({ images, productTitle }: ProductCarouselProps) {
    // 1. Initialize Embla
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: images.length > 1,
        skipSnaps: false,
        align: 'start',
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    // 2. Navigation Handlers
    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    if (!images || images.length === 0) {
        return (
            <div className="w-full bg-gray-100 flex items-center justify-center rounded-lg aspect-[11/14]">
                <p className="text-gray-400 text-sm">No images available</p>
            </div>
        );
    }

    return (
        /* 
           IMPORTANT: The 'min-w-0' on this top div prevents the carousel 
           from expanding the entire modal width to fit all images. 
        */
        <div className="w-full min-w-0">
            <div className="relative group">

                {/* VIEWPORT: Added 'min-w-0' here */}
                <div
                    className="overflow-hidden rounded-lg w-full min-w-0"
                    ref={emblaRef}
                >
                    {/* CONTAINER: flex is required for Embla */}
                    <div className="flex touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
                        {images.map((image, index) => (
                            /* 
                               SLIDE: 'flex-none w-full' ensures exactly one image 
                               fills the container at a time.
                            */
                            <div
                                key={index}
                                className="flex-none w-full min-w-0"
                            >
                                <div className="relative w-full aspect-[11/14] bg-gray-100">
                                    <img
                                        src={image}
                                        alt={`${productTitle} - Image ${index + 1}`}
                                        className="absolute inset-0 w-full h-full object-cover select-none"
                                        loading={index === 0 ? "eager" : "lazy"}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={scrollPrev}
                            disabled={!canScrollPrev}
                            className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all z-10 
                ${canScrollPrev ? 'opacity-0 group-hover:opacity-100' : 'pointer-events-none opacity-0'}`}
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                            onClick={scrollNext}
                            disabled={!canScrollNext}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all z-10 
                ${canScrollNext ? 'opacity-0 group-hover:opacity-100' : 'pointer-events-none opacity-0'}`}
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Page Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur-sm">
                        {selectedIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Pagination Dots */}
            {images.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-4">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === selectedIndex ? 'bg-black w-6' : 'bg-gray-300 w-1.5 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}