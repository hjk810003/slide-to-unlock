import React, { useState, useRef, useEffect } from "react";

const SlideToUnlock = () => {
    const [position, setPosition] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef(null);
    const containerRef = useRef(null);
    const startX = useRef(0);
    const animationFrameId = useRef(null);

    const containerWidth = 300; // 슬라이드 전체 너비
    const handleWidth = 50; // 핸들 크기
    const unlockThreshold = 0.5; // 50% 임계값

    // 드래그 시작
    const handleMouseDown = (e) => {
        setIsDragging(true);
        startX.current = e.clientX - position;
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        startX.current = e.touches[0].clientX - position;
    };

    // 드래그 중
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newPosX = e.clientX - startX.current;
        updatePosition(newPosX);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const newPosX = e.touches[0].clientX - startX.current;
        updatePosition(newPosX);
    };

    // 드래그 해제
    const handleMouseUp = () => {
        setIsDragging(false);
        finalizePosition();
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        finalizePosition();
    };

    // 위치 업데이트
    const updatePosition = (newPosX) => {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = requestAnimationFrame(() => {
            if (newPosX >= 0 && newPosX <= containerWidth - handleWidth) {
                setPosition(newPosX);
            }
        });
    };

    // 드래그 종료 시 위치 처리
    const finalizePosition = () => {
        if (position / (containerWidth - handleWidth) >= unlockThreshold) {
            setPosition(containerWidth - handleWidth); // 끝으로 이동
        } else {
            setPosition(0); // 처음으로 되돌아감
        }
    };

    useEffect(() => {
        const handleDocumentMouseUp = () => {
            if (isDragging) handleMouseUp();
        };
        document.addEventListener("mouseup", handleDocumentMouseUp);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("touchend", handleTouchEnd);
        document.addEventListener("touchmove", handleTouchMove);

        return () => {
            document.removeEventListener("mouseup", handleDocumentMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("touchend", handleTouchEnd);
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, [isDragging, position]);

    return (
        <div
            ref={containerRef}
            style={{
                width: containerWidth,
                height: 50,
                background: "#ddd",
                borderRadius: 25,
                position: "relative",
                userSelect: "none",
            }}
        >
            <div
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                style={{
                    width: handleWidth,
                    height: 50,
                    background: "#4CAF50",
                    borderRadius: "50%",
                    position: "absolute",
                    left: position,
                    cursor: "pointer",
                    transition: isDragging ? "none" : "left 0.3s ease",
                }}
            ></div>
            <span
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#888",
                }}
            >
        Slide to Unlock
      </span>
        </div>
    );
};

export default SlideToUnlock;
