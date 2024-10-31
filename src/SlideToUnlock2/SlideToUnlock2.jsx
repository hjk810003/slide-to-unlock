import "./SlideToUnlock2.css";

import { useState, useEffect, useRef } from "react";

const isTouchDevice = "ontouchstart" in document.documentElement;

export default function SlideToUnlock2() {
    const container = useRef(null);
    const slider = useRef(null);

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [unlocked, setUnlocked] = useState(false);
    const [sliderLeft, setSliderLeft] = useState(0);

    const startDrag = (e) => {
        if (unlocked) return;

        setIsDragging(true);
        setStartX(isTouchDevice ? e.touches[0].clientX : e.clientX);
    };

    const onSuccess = () => {
        container.current.style.width = container.current.clientWidth + "px";
        setUnlocked(true);
    };

    const getText = () => {
        return unlocked ? "UNLOCKED" : "SLIDE";
    };

    const onDrag = (e) => {
        if (unlocked) return;

        if (isDragging) {
            const clientX = isTouchDevice ? e.touches[0].clientX : e.clientX;
            setSliderLeft(Math.min(Math.max(0, clientX - startX), containerWidth));
        }
    };

    const onStopDrag = () => {
        if (unlocked) return;

        if (isDragging) {
            setIsDragging(false);
            if (sliderLeft > containerWidth * 0.9) {
                setSliderLeft(containerWidth.current);
                onSuccess();
            } else {
                setSliderLeft(0);
            }
        }
    };

    useEffect(() => {
        setContainerWidth(container.current.clientWidth - 50);

        if (isTouchDevice) {
            document.addEventListener("touchmove", onDrag);
            document.addEventListener("touchend", onStopDrag);
        } else {
            document.addEventListener("mousemove", onDrag);
            document.addEventListener("mouseup", onStopDrag);
        }

        return () => {
            document.removeEventListener("touchmove", onDrag);
            document.removeEventListener("touchend", onStopDrag);
            document.removeEventListener("mousemove", onDrag);
            document.removeEventListener("mouseup", onStopDrag);
        };
    }, [sliderLeft, unlocked]);

    return (
        <div className="ReactSwipeButton">
            <div
                className={"rsbContainer " + (unlocked ? "rsbContainerUnlocked" : "")}
                ref={container}
            >
                <div
                    className="rsbcSlider"
                    ref={slider}
                    onMouseDown={startDrag}
                    style={{ left: sliderLeft + 50 + "px" }}
                    onTouchStart={startDrag}
                >
                    <span className="rsbcSliderText">{getText()}</span>
                    <span className="rsbcSliderArrow"></span>
                    <span className="rsbcSliderCircle"></span>
                </div>
                <div className="rsbcText">{getText()}</div>
            </div>
        </div>
    );
}