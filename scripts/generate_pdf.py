#!/usr/bin/env python3
"""
Simple, pure-Python PDF generator for 2-slide candidate presentation.
Zero external dependencies required.
"""

def escape_pdf_text(text):
    return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

def build_pdf():
    # Page size: 960 x 540 (16:9 widescreen presentation)
    W, H = 960, 540

    def rect(x, y, w, h, fill_rgb=None, stroke_rgb=None, stroke_w=1):
        cmds = []
        if stroke_rgb:
            cmds.append(f"{stroke_w} w {stroke_rgb[0]} {stroke_rgb[1]} {stroke_rgb[2]} RG")
        if fill_rgb:
            cmds.append(f"{fill_rgb[0]} {fill_rgb[1]} {fill_rgb[2]} rg")
        cmds.append(f"{x} {y} {w} {h} re")
        if fill_rgb and stroke_rgb:
            cmds.append("B")
        elif fill_rgb:
            cmds.append("f")
        elif stroke_rgb:
            cmds.append("S")
        return "\n".join(cmds)

    def text_line(x, y, font, size, rgb, text):
        escaped = escape_pdf_text(text)
        return (
            f"BT\n"
            f"/{font} {size} Tf\n"
            f"{rgb[0]} {rgb[1]} {rgb[2]} rg\n"
            f"1 0 0 1 {x} {y} Tm\n"
            f"({escaped}) Tj\n"
            f"ET"
        )

    # Slide 1 Content Stream
    s1_cmds = []
    # Background
    s1_cmds.append(rect(0, 0, W, H, fill_rgb=(0.047, 0.067, 0.106)))
    # Top badge
    s1_cmds.append(text_line(50, 485, "F2", 11, (0.505, 0.549, 0.973), "TECHNICAL INTERVIEW WALKTHROUGH  |  SLIDE 1 OF 2"))
    # Header Title & Subtitle
    s1_cmds.append(text_line(50, 448, "F2", 26, (1, 1, 1), "Multiplayer Chat with Rooms"))
    s1_cmds.append(text_line(50, 426, "F1", 13, (0.58, 0.639, 0.722), "Real-time room-based communication architecture, components, and technology stack"))

    # Left Card: What Was Built
    s1_cmds.append(rect(50, 75, 415, 325, fill_rgb=(0.082, 0.11, 0.173), stroke_rgb=(0.141, 0.184, 0.278), stroke_w=1))
    # Dot accent
    s1_cmds.append(rect(72, 366, 8, 8, fill_rgb=(0.063, 0.725, 0.506)))
    s1_cmds.append(text_line(90, 364, "F2", 16, (0.945, 0.961, 0.976), "What Was Built"))

    s1_left_bullets = [
        ("Room-Based Live Chat:", "Users join or create rooms by name with instant"),
        ("", "multi-client updates via Firestore real-time listeners."),
        ("Component-Driven Architecture:", "Structured into 5 modular React"),
        ("", "components: RoomSelection, ChatRoom, MessageList,"),
        ("", "MessageItem, and MessageInput."),
        ("Timestamps & Visual Distinction:", "Automatic message timestamps,"),
        ("", "sender-based bubble alignments, and hashed avatar colors."),
        ("Zero-Config Demo Mode:", "Automatic BroadcastChannel fallback"),
        ("", "allowing reviewers to test multi-tab chat without API keys."),
    ]
    cur_y = 330
    for header, line in s1_left_bullets:
        if header:
            s1_cmds.append(text_line(72, cur_y, "F2", 12, (0.505, 0.549, 0.973), "- " + header))
            cur_y -= 17
        s1_cmds.append(text_line(84, cur_y, "F1", 11.5, (0.75, 0.8, 0.86), line))
        cur_y -= 16

    # Right Card: The Tech Stack
    s1_cmds.append(rect(495, 75, 415, 325, fill_rgb=(0.082, 0.11, 0.173), stroke_rgb=(0.141, 0.184, 0.278), stroke_w=1))
    s1_cmds.append(rect(517, 366, 8, 8, fill_rgb=(0.063, 0.725, 0.506)))
    s1_cmds.append(text_line(535, 364, "F2", 16, (0.945, 0.961, 0.976), "The Tech Stack"))

    s1_right_bullets = [
        ("React 19 & Vite 6:", "Functional components with hooks (useState,"),
        ("", "useEffect, useRef) with lightning-fast bundling (<1.2s build)."),
        ("Firebase Firestore (v11):", "Real-time subscriptions (onSnapshot),"),
        ("", "server timestamps, and decoupled service architecture."),
        ("Optimized Subcollection Schema:", "rooms/{roomId}/messages eliminates"),
        ("", "Firestore composite index requirements out-of-the-box."),
        ("Modern Custom CSS:", "Dark aesthetic, responsive mobile layout,"),
        ("", "smooth auto-scroll anchor, and zero heavy UI dependencies."),
    ]
    cur_y = 330
    for header, line in s1_right_bullets:
        if header:
            s1_cmds.append(text_line(517, cur_y, "F2", 12, (0.505, 0.549, 0.973), "- " + header))
            cur_y -= 17
        s1_cmds.append(text_line(529, cur_y, "F1", 11.5, (0.75, 0.8, 0.86), line))
        cur_y -= 16

    # Footer Watermark
    s1_cmds.append(text_line(50, 35, "F1", 10.5, (0.392, 0.455, 0.545), "Candidate Technical Submission  |  Multiplayer Chat Challenge"))
    s1_cmds.append(text_line(810, 35, "F2", 10.5, (0.392, 0.455, 0.545), "SLIDE 1 OF 2"))

    # Slide 2 Content Stream
    s2_cmds = []
    # Background
    s2_cmds.append(rect(0, 0, W, H, fill_rgb=(0.047, 0.067, 0.106)))
    # Top badge
    s2_cmds.append(text_line(50, 485, "F2", 11, (0.96, 0.62, 0.043), "CRITICAL ASSESSMENT & NEXT STEPS  |  SLIDE 2 OF 2"))
    # Header Title & Subtitle
    s2_cmds.append(text_line(50, 448, "F2", 26, (1, 1, 1), "AI Reflection & Engineering Decisions"))
    s2_cmds.append(text_line(50, 426, "F1", 13, (0.58, 0.639, 0.722), "Where AI missed the mark, architectural corrections applied, and technical uncertainties"))

    # Left Card: What the AI Missed
    s2_cmds.append(rect(50, 75, 415, 325, fill_rgb=(0.082, 0.11, 0.173), stroke_rgb=(0.141, 0.184, 0.278), stroke_w=1))
    s2_cmds.append(rect(72, 366, 8, 8, fill_rgb=(0.96, 0.62, 0.043)))
    s2_cmds.append(text_line(90, 364, "F2", 16, (0.945, 0.961, 0.976), "What the AI Got Wrong / What I Corrected"))

    s2_left_bullets = [
        ("The Firestore Indexing Trap:", "AI code defaulted to flat collection queries:"),
        ("", "where('room', '==', id) + orderBy('createdAt'). In Firestore,"),
        ("", "this crashes without a manual composite index. Corrected to"),
        ("", "subcollections (rooms/{id}/messages) for automatic indexing."),
        ("Missing Zero-Config Developer UX:", "AI assumed live credentials;"),
        ("", "missing keys resulted in blank screens. Architected a seamless"),
        ("", "BroadcastChannel fallback for immediate multi-tab demoing."),
        ("State Management Over-Engineering:", "AI often introduces Redux"),
        ("", "or Context for simple flows. Chose explicit props & local state."),
    ]
    cur_y = 330
    for header, line in s2_left_bullets:
        if header:
            s2_cmds.append(text_line(72, cur_y, "F2", 12, (0.96, 0.62, 0.043), "- " + header))
            cur_y -= 17
        s2_cmds.append(text_line(84, cur_y, "F1", 11.5, (0.75, 0.8, 0.86), line))
        cur_y -= 16

    # Right Card: The Part I Am Least Sure About
    s2_cmds.append(rect(495, 75, 415, 325, fill_rgb=(0.082, 0.11, 0.173), stroke_rgb=(0.141, 0.184, 0.278), stroke_w=1))
    s2_cmds.append(rect(517, 366, 8, 8, fill_rgb=(0.96, 0.62, 0.043)))
    s2_cmds.append(text_line(535, 364, "F2", 16, (0.945, 0.961, 0.976), "Least Sure About & Future Iterations"))

    s2_right_bullets = [
        ("Room Discovery at Scale:", "Subcollections isolate room messages"),
        ("", "efficiently, but listing active rooms requires maintaining a"),
        ("", "separate root /rooms catalog or Collection Group Queries."),
        ("Presence & Typing Indicators:", "Firestore document writes are too"),
        ("", "costly and slow for typing heartbeats. In production, Firebase"),
        ("", "Realtime Database is better suited for ephemeral presence."),
        ("Authentication & Impersonation:", "Display names are currently"),
        ("", "unauthenticated. Production requires Firebase Auth integration"),
        ("", "with Firestore Security Rules to prevent spoofing."),
    ]
    cur_y = 330
    for header, line in s2_right_bullets:
        if header:
            s2_cmds.append(text_line(517, cur_y, "F2", 12, (0.96, 0.62, 0.043), "- " + header))
            cur_y -= 17
        s2_cmds.append(text_line(529, cur_y, "F1", 11.5, (0.75, 0.8, 0.86), line))
        cur_y -= 16

    # Footer Watermark
    s2_cmds.append(text_line(50, 35, "F1", 10.5, (0.392, 0.455, 0.545), "Candidate Technical Submission  |  Multiplayer Chat Challenge"))
    s2_cmds.append(text_line(810, 35, "F2", 10.5, (0.392, 0.455, 0.545), "SLIDE 2 OF 2"))

    stream1 = "\n".join(s1_cmds).encode('latin-1')
    stream2 = "\n".join(s2_cmds).encode('latin-1')

    # Construct standard PDF 1.4 objects
    objects = []

    def add_object(content_bytes):
        idx = len(objects) + 1
        objects.append(content_bytes)
        return idx

    # Obj 1: Catalog
    add_object(b"<< /Type /Catalog /Pages 2 0 R >>")
    # Obj 2: Pages
    add_object(b"<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>")
    # Obj 3: Page 1
    add_object(f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {W} {H}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 7 0 R >>".encode('ascii'))
    # Obj 4: Page 2
    add_object(f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {W} {H}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 8 0 R >>".encode('ascii'))
    # Obj 5: Font F1 (Helvetica)
    add_object(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    # Obj 6: Font F2 (Helvetica-Bold)
    add_object(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
    # Obj 7: Content stream Page 1
    add_object(f"<< /Length {len(stream1)} >>\nstream\n".encode('ascii') + stream1 + b"\nendstream")
    # Obj 8: Content stream Page 2
    add_object(f"<< /Length {len(stream2)} >>\nstream\n".encode('ascii') + stream2 + b"\nendstream")

    # Assemble PDF with cross reference table
    out = bytearray()
    out.extend(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")

    offsets = []
    for i, obj in enumerate(objects):
        offsets.append(len(out))
        out.extend(f"{i + 1} 0 obj\n".encode('ascii'))
        out.extend(obj)
        out.extend(b"\nendobj\n")

    xref_offset = len(out)
    out.extend(f"xref\n0 {len(objects) + 1}\n".encode('ascii'))
    out.extend(b"0000000000 65535 f \n")
    for off in offsets:
        out.extend(f"{off:010d} 00000 n \n".encode('ascii'))

    out.extend(
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
        f"startxref\n{xref_offset}\n%%EOF\n".encode('ascii')
    )

    with open("slides.pdf", "wb") as f:
        f.write(out)
    print("Created slides.pdf successfully (size: %d bytes)" % len(out))

if __name__ == '__main__':
    build_pdf()
