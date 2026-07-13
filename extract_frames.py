#!/usr/bin/env python3
"""
Extract frames from parallax source videos.
Saves as JPEG (quality 85) for web performance.
"""
import cv2
import os
import sys

def extract_frames(video_path, output_dir, skip=1, max_frames=None, start_frame=0, end_frame=None):
    """Extract frames from video, saving every `skip`th frame as JPEG."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"ERROR: Cannot open {video_path}")
        return 0

    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    if end_frame is None:
        end_frame = total
    
    print(f"  Source: {video_path}")
    print(f"  {total} total frames, {fps:.1f}fps, {w}x{h}")
    print(f"  Extracting frames {start_frame}-{end_frame}, every {skip}th frame")

    os.makedirs(output_dir, exist_ok=True)
    
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
    
    frame_idx = start_frame
    saved = 0
    
    while frame_idx < end_frame:
        ret, frame = cap.read()
        if not ret:
            break
        
        if (frame_idx - start_frame) % skip == 0:
            out_path = os.path.join(output_dir, f"frame_{saved:04d}.jpg")
            cv2.imwrite(out_path, frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            saved += 1
            
            if max_frames and saved >= max_frames:
                break
        
        frame_idx += 1
    
    cap.release()
    print(f"  → Saved {saved} frames to {output_dir}/")
    return saved


def extract_boomerang(video_path, output_dir, skip=1, black_cutoff_seconds=1.0):
    """Extract boomerang: forward frames then reversed, cutting black tail."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"ERROR: Cannot open {video_path}")
        return 0
    
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # Cut the last ~1 second (black frames)
    cut_frames = int(black_cutoff_seconds * fps)
    usable_total = total - cut_frames
    
    print(f"  Source: {video_path}")
    print(f"  {total} total frames, {fps:.1f}fps, {w}x{h}")
    print(f"  Cutting last {cut_frames} frames (black), using {usable_total} frames")
    
    # Read all usable frames into memory (small video, only 4MB)
    frames = []
    for i in range(usable_total):
        ret, frame = cap.read()
        if not ret:
            break
        if i % skip == 0:
            frames.append(frame)
    
    cap.release()
    
    # The video itself IS already a boomerang (forward then backward)
    # So we just extract the frames in order — no need to manually reverse
    os.makedirs(output_dir, exist_ok=True)
    saved = 0
    for frame in frames:
        out_path = os.path.join(output_dir, f"frame_{saved:04d}.jpg")
        cv2.imwrite(out_path, frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
        saved += 1
    
    print(f"  → Saved {saved} frames to {output_dir}/")
    return saved


if __name__ == "__main__":
    print("=" * 60)
    print("TREE SHOT — ambient-1-trimmed.mp4")
    print("=" * 60)
    # 241 frames total, extract every 3rd → ~80 frames
    tree_count = extract_frames(
        "assets/ambient-loops/ambient-1-trimmed.mp4",
        "assets/parallax/tree",
        skip=3
    )
    
    print()
    print("=" * 60)
    print("DRONE SHOT — ambient-2.mp4")
    print("=" * 60)
    # 948 frames total, extract every 8th → ~118 frames
    # Full sweep close→far
    drone_count = extract_frames(
        "assets/ambient-loops/ambient-2.mp4",
        "assets/parallax/drone",
        skip=8
    )
    
    print()
    print("=" * 60)
    print("BOOMERANG — joined_video.MP4")
    print("=" * 60)
    # 266 frames, 11s, last ~1s is black. Extract every 2nd → ~60 frames forward+back
    boom_count = extract_boomerang(
        "assets/ambient-loops/joined_video_b24a908405404ff79ebba039adc3d7d9.MP4",
        "assets/parallax/boomerang",
        skip=2,
        black_cutoff_seconds=1.0
    )
    
    print()
    print("=" * 60)
    print(f"DONE — Tree: {tree_count}, Drone: {drone_count}, Boomerang: {boom_count}")
    print("=" * 60)
