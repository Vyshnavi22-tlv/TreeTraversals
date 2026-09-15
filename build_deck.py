"""
Script to generate a professional 14-slide Computer Science seminar PowerPoint presentation:
"Tree Traversals — Understanding Inorder, Preorder & Postorder"
Styled with a developer-tool dark theme (obsidian/slate background, emerald/sky/purple accents,
native PowerPoint shapes, custom tree diagrams, recursive pseudocode, step matrices, and complexity).
"""

import sys
import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

# ==========================================
# COLOR PALETTE DEFINITIONS
# ==========================================
BG_COLOR = RGBColor(9, 13, 22)           # Near-black obsidian slate #090D16
SURFACE_COLOR = RGBColor(19, 27, 42)      # Deep container card #131B2A
SURFACE_BORDER = RGBColor(35, 50, 74)     # Border for containers #23324A
SURFACE_INNER = RGBColor(14, 20, 32)      # Darker inner container for code #0E1420
INNER_BORDER = RGBColor(28, 38, 56)       # Subtle inner border

# Accent Palette
EMERALD = RGBColor(16, 185, 129)          # Inorder accent #10B981
EMERALD_LIGHT = RGBColor(52, 211, 153)    # Glowing emerald #34D399
EMERALD_BG = RGBColor(10, 38, 30)         # Soft emerald container tint

SKY = RGBColor(56, 189, 248)              # Preorder accent #38BDF8
SKY_LIGHT = RGBColor(125, 211, 252)       # Light sky blue
SKY_BG = RGBColor(12, 35, 55)             # Soft sky container tint

PURPLE = RGBColor(168, 85, 247)           # Postorder accent #A855F7
PURPLE_LIGHT = RGBColor(192, 132, 252)    # Light purple
PURPLE_BG = RGBColor(35, 18, 50)          # Soft purple container tint

AMBER = RGBColor(245, 158, 11)            # Attention / warning accent #F59E0B
AMBER_BG = RGBColor(40, 28, 10)

# Typography Colors
TEXT_WHITE = RGBColor(248, 250, 252)      # Off-white headings #F8FAFC
TEXT_MUTED = RGBColor(148, 163, 184)      # Secondary description #94A3B8
TEXT_DIM = RGBColor(100, 116, 139)        # Subtle footnotes #64748B
TEXT_CODE = RGBColor(226, 232, 240)       # Monospace code text #E2E8F0

# Node & Line Colors
NODE_FILL_DEFAULT = RGBColor(24, 32, 47)
NODE_BORDER_DEFAULT = RGBColor(51, 65, 85)
EDGE_LINE_COLOR = RGBColor(71, 85, 105)

FONT_SANS = "Segoe UI"
FONT_CODE = "Consolas"


def set_slide_background(slide):
    """Fills the slide with the primary obsidian background color."""
    bg_shape = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)
    )
    bg_shape.fill.solid()
    bg_shape.fill.fore_color.rgb = BG_COLOR
    bg_shape.line.fill.background()


def add_header(slide, category_text, title_text, subtitle_text="", accent_color=EMERALD):
    """Renders a modern developer-style header banner with category tag, title, and divider."""
    pill = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.48), Inches(3.2), Inches(0.28)
    )
    pill.fill.solid()
    pill.fill.fore_color.rgb = SURFACE_INNER
    pill.line.color.rgb = accent_color
    pill.line.width = Pt(1)
    tf = pill.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = category_text.upper()
    p.font.name = FONT_CODE
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = accent_color
    p.alignment = PP_ALIGN.CENTER

    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.78), Inches(11.7), Inches(0.55))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
    p_title = tf_title.paragraphs[0]
    p_title.text = title_text
    p_title.font.name = FONT_SANS
    p_title.font.size = Pt(25)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE

    if subtitle_text:
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.36), Inches(11.7), Inches(0.35))
        tf_sub = sub_box.text_frame
        tf_sub.word_wrap = True
        tf_sub.margin_left = tf_sub.margin_top = tf_sub.margin_right = tf_sub.margin_bottom = 0
        p_sub = tf_sub.paragraphs[0]
        p_sub.text = subtitle_text
        p_sub.font.name = FONT_SANS
        p_sub.font.size = Pt(12)
        p_sub.font.color.rgb = TEXT_MUTED

    divider = slide.shapes.add_connector(
        MSO_CONNECTOR.STRAIGHT, Inches(0.8), Inches(1.75), Inches(12.533), Inches(1.75)
    )
    divider.line.color.rgb = INNER_BORDER
    divider.line.width = Pt(1)


def add_card(slide, left, top, width, height, fill_color=SURFACE_COLOR, border_color=SURFACE_BORDER, border_width=1):
    """Creates a rounded container card for visual grouping."""
    card = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height)
    )
    card.fill.solid()
    card.fill.fore_color.rgb = fill_color
    if border_color:
        card.line.color.rgb = border_color
        card.line.width = Pt(border_width)
    else:
        card.line.fill.background()
    return card


def draw_tree_canonical(slide, root_x, root_y, step_numbers=None, active_color=EMERALD,
                        highlight_node=None, node_size=0.62, scale_x=1.0, scale_y=1.0):
    """
    Renders the canonical 5-node tree:
            A
           / \
          B   C
         / \
        D   E
    Using native PowerPoint connectors and circles with step badges.
    """
    dx1 = 1.35 * scale_x
    dy1 = 1.05 * scale_y
    dx2 = 0.70 * scale_x
    dy2 = 1.05 * scale_y

    coords = {
        'A': (root_x, root_y),
        'B': (root_x - dx1, root_y + dy1),
        'C': (root_x + dx1, root_y + dy1),
        'D': (root_x - dx1 - dx2, root_y + dy1 + dy2),
        'E': (root_x - dx1 + dx2, root_y + dy1 + dy2)
    }

    edges = [
        ('A', 'B'),
        ('A', 'C'),
        ('B', 'D'),
        ('B', 'E')
    ]

    # 1. Draw edge lines first so they sit behind nodes
    for parent_id, child_id in edges:
        p_x, p_y = coords[parent_id]
        c_x, c_y = coords[child_id]
        line = slide.shapes.add_connector(
            MSO_CONNECTOR.STRAIGHT, Inches(p_x), Inches(p_y), Inches(c_x), Inches(c_y)
        )
        line.line.color.rgb = EDGE_LINE_COLOR
        line.line.width = Pt(2.2)

    # 2. Draw nodes (circles with labels)
    for node_id, (nx, ny) in coords.items():
        left = nx - (node_size / 2.0)
        top = ny - (node_size / 2.0)

        oval = slide.shapes.add_shape(
            MSO_SHAPE.OVAL, Inches(left), Inches(top), Inches(node_size), Inches(node_size)
        )
        oval.fill.solid()

        is_highlighted = (highlight_node == node_id)
        has_step = (step_numbers is not None and node_id in step_numbers)

        if is_highlighted:
            oval.fill.fore_color.rgb = active_color
            oval.line.color.rgb = TEXT_WHITE
            oval.line.width = Pt(2.5)
        elif has_step:
            oval.fill.fore_color.rgb = NODE_FILL_DEFAULT
            oval.line.color.rgb = active_color
            oval.line.width = Pt(2.0)
        else:
            oval.fill.fore_color.rgb = NODE_FILL_DEFAULT
            oval.line.color.rgb = NODE_BORDER_DEFAULT
            oval.line.width = Pt(1.5)

        tf = oval.text_frame
        tf.word_wrap = False
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.text = node_id
        p.font.name = FONT_SANS
        p.font.size = Pt(14 * (node_size / 0.62))
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE if not is_highlighted else RGBColor(10, 20, 15)
        p.alignment = PP_ALIGN.CENTER

        # 3. Add order badge if step_numbers provided
        if step_numbers and node_id in step_numbers:
            badge_val = str(step_numbers[node_id])
            badge_size = 0.28 * (node_size / 0.62)
            b_left = nx + (node_size * 0.28)
            b_top = ny - (node_size * 0.48)
            badge = slide.shapes.add_shape(
                MSO_SHAPE.OVAL, Inches(b_left), Inches(b_top), Inches(badge_size), Inches(badge_size)
            )
            badge.fill.solid()
            badge.fill.fore_color.rgb = active_color
            badge.line.color.rgb = BG_COLOR
            badge.line.width = Pt(1.2)
            btf = badge.text_frame
            btf.vertical_anchor = MSO_ANCHOR.MIDDLE
            bp = btf.paragraphs[0]
            bp.text = badge_val
            bp.font.name = FONT_CODE
            bp.font.size = Pt(8.5)
            bp.font.bold = True
            bp.font.color.rgb = RGBColor(10, 15, 20)
            bp.alignment = PP_ALIGN.CENTER


def add_code_block(slide, left, top, width, height, lines, title="ALGORITHM"):
    """Renders a styled dark terminal/editor code snippet box."""
    card = add_card(slide, left, top, width, height, fill_color=SURFACE_INNER, border_color=SURFACE_BORDER, border_width=1.5)

    tb_header = slide.shapes.add_textbox(Inches(left + 0.2), Inches(top + 0.12), Inches(width - 0.4), Inches(0.3))
    tf_h = tb_header.text_frame
    p_h = tf_h.paragraphs[0]
    p_h.text = f"// {title}"
    p_h.font.name = FONT_CODE
    p_h.font.size = Pt(9.5)
    p_h.font.bold = True
    p_h.font.color.rgb = EMERALD_LIGHT

    tb_code = slide.shapes.add_textbox(Inches(left + 0.2), Inches(top + 0.45), Inches(width - 0.4), Inches(height - 0.55))
    tf = tb_code.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

    for idx, line_text in enumerate(lines):
        p = tf.add_paragraph() if idx > 0 else tf.paragraphs[0]
        p.text = line_text
        p.font.name = FONT_CODE
        p.font.size = Pt(11)
        p.line_spacing = 1.25

        if line_text.strip().startswith("//"):
            p.font.color.rgb = TEXT_DIM
        elif any(k in line_text for k in ["if", "return", "function"]):
            p.font.color.rgb = SKY_LIGHT
            p.font.bold = True
        elif "VISIT" in line_text:
            p.font.color.rgb = EMERALD_LIGHT
            p.font.bold = True
        else:
            p.font.color.rgb = TEXT_CODE


def add_sequence_chips(slide, left, top, sequence_items, accent_color=EMERALD, chip_w=0.6, chip_h=0.45, gap=0.35):
    """Renders a series of node chips linked with arrows (e.g. D → B → E → A → C)."""
    cur_x = left
    for i, item in enumerate(sequence_items):
        chip = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cur_x), Inches(top), Inches(chip_w), Inches(chip_h)
        )
        chip.fill.solid()
        chip.fill.fore_color.rgb = SURFACE_INNER
        chip.line.color.rgb = accent_color
        chip.line.width = Pt(1.5)
        tf = chip.text_frame
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.text = item
        p.font.name = FONT_SANS
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.alignment = PP_ALIGN.CENTER

        cur_x += chip_w

        if i < len(sequence_items) - 1:
            arrow_box = slide.shapes.add_textbox(Inches(cur_x), Inches(top), Inches(gap), Inches(chip_h))
            atf = arrow_box.text_frame
            atf.vertical_anchor = MSO_ANCHOR.MIDDLE
            ap = atf.paragraphs[0]
            ap.text = "→"
            ap.font.name = FONT_SANS
            ap.font.size = Pt(13)
            ap.font.bold = True
            ap.font.color.rgb = accent_color
            ap.alignment = PP_ALIGN.CENTER
            cur_x += gap


# ==============================================================================
# SLIDE BUILDERS (1 TO 14)
# ==============================================================================

def build_slide_1(prs):
    """Slide 1 — Title Slide: TREE TRAVERSALS"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)

    add_card(slide, 0.8, 1.2, 5.8, 5.15, fill_color=SURFACE_COLOR, border_color=SURFACE_BORDER, border_width=1)
    add_card(slide, 6.9, 1.2, 5.6, 5.15, fill_color=SURFACE_INNER, border_color=SURFACE_BORDER, border_width=1)

    pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.1), Inches(1.55), Inches(3.6), Inches(0.3))
    pill.fill.solid()
    pill.fill.fore_color.rgb = SURFACE_INNER
    pill.line.color.rgb = EMERALD
    pill.line.width = Pt(1.2)
    tf = pill.text_frame
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = "COMPUTER SCIENCE SEMINAR • DSA"
    p.font.name = FONT_CODE
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = EMERALD_LIGHT
    p.alignment = PP_ALIGN.CENTER

    tb_title = slide.shapes.add_textbox(Inches(1.1), Inches(2.05), Inches(5.2), Inches(1.5))
    tf_t = tb_title.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    p_t.text = "TREE\nTRAVERSALS"
    p_t.font.name = FONT_SANS
    p_t.font.size = Pt(38)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE
    p_t.line_spacing = 0.95

    tb_sub = slide.shapes.add_textbox(Inches(1.1), Inches(3.65), Inches(5.2), Inches(0.7))
    tf_s = tb_sub.text_frame
    tf_s.word_wrap = True
    p_s = tf_s.paragraphs[0]
    p_s.text = "Understanding Inorder, Preorder & Postorder"
    p_s.font.name = FONT_SANS
    p_s.font.size = Pt(16)
    p_s.font.bold = True
    p_s.font.color.rgb = EMERALD_LIGHT

    tb_desc = slide.shapes.add_textbox(Inches(1.1), Inches(4.35), Inches(5.0), Inches(0.85))
    tf_d = tb_desc.text_frame
    tf_d.word_wrap = True
    p_d = tf_d.paragraphs[0]
    p_d.text = "A structured conceptual guide to systematic node exploration, recursive mechanics, complexity tradeoffs, and real-world software applications."
    p_d.font.name = FONT_SANS
    p_d.font.size = Pt(11)
    p_d.font.color.rgb = TEXT_MUTED

    meta_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.1), Inches(5.45), Inches(5.0), Inches(0.55))
    meta_box.fill.solid()
    meta_box.fill.fore_color.rgb = SURFACE_INNER
    meta_box.line.color.rgb = INNER_BORDER
    mtf = meta_box.text_frame
    mtf.vertical_anchor = MSO_ANCHOR.MIDDLE
    mp = mtf.paragraphs[0]
    mp.text = "PAIR PROGRAMMING COMPANION  |  INTERACTIVE VISUALIZER SUITE"
    mp.font.name = FONT_CODE
    mp.font.size = Pt(8.5)
    mp.font.bold = True
    mp.font.color.rgb = TEXT_DIM
    mp.alignment = PP_ALIGN.CENTER

    tree_header = slide.shapes.add_textbox(Inches(7.2), Inches(1.4), Inches(5.0), Inches(0.4))
    th_tf = tree_header.text_frame
    th_p = th_tf.paragraphs[0]
    th_p.text = "CANONICAL REFERENCE BENCHMARK TREE"
    th_p.font.name = FONT_CODE
    th_p.font.size = Pt(10)
    th_p.font.bold = True
    th_p.font.color.rgb = SKY_LIGHT

    draw_tree_canonical(slide, root_x=9.7, root_y=2.25, node_size=0.62, scale_x=1.1, scale_y=0.95)

    prev_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.2), Inches(4.85), Inches(5.0), Inches(1.2))
    prev_box.fill.solid()
    prev_box.fill.fore_color.rgb = SURFACE_COLOR
    prev_box.line.color.rgb = INNER_BORDER
    ptf = prev_box.text_frame
    ptf.margin_top = Inches(0.08)

    p1 = ptf.paragraphs[0]
    p1.text = "INORDER   :  D → B → E → A → C   (L-N-R)"
    p1.font.name = FONT_CODE
    p1.font.size = Pt(9.5)
    p1.font.bold = True
    p1.font.color.rgb = EMERALD_LIGHT

    p2 = ptf.add_paragraph()
    p2.text = "PREORDER  :  A → B → D → E → C   (N-L-R)"
    p2.font.name = FONT_CODE
    p2.font.size = Pt(9.5)
    p2.font.bold = True
    p2.font.color.rgb = SKY_LIGHT

    p3 = ptf.add_paragraph()
    p3.text = "POSTORDER :  D → E → B → C → A   (L-R-N)"
    p3.font.name = FONT_CODE
    p3.font.size = Pt(9.5)
    p3.font.bold = True
    p3.font.color.rgb = PURPLE_LIGHT


def build_slide_2(prs):
    """Slide 2 — Why Do We Need Traversal?"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(slide, "MOTIVATION & PROBLEM STATEMENT", "Why Do We Need Tree Traversal?",
               "Moving from linear sequential structures to non-linear hierarchical branching")

    # Left Container
    add_card(slide, 0.8, 1.95, 5.8, 4.95)

    sh1 = slide.shapes.add_textbox(Inches(1.1), Inches(2.15), Inches(5.2), Inches(0.4))
    sh1.text_frame.paragraphs[0].text = "The Non-Linear Exploration Dilemma"
    sh1.text_frame.paragraphs[0].font.name = FONT_SANS
    sh1.text_frame.paragraphs[0].font.size = Pt(17)
    sh1.text_frame.paragraphs[0].font.bold = True
    sh1.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    add_card(slide, 1.1, 2.7, 5.2, 0.95, fill_color=SURFACE_INNER, border_color=INNER_BORDER)
    tb_lin = slide.shapes.add_textbox(Inches(1.2), Inches(2.75), Inches(5.0), Inches(0.85))
    tf_l = tb_lin.text_frame
    tf_l.word_wrap = True
    p1 = tf_l.paragraphs[0]
    p1.text = "1. Linear Structures (Arrays, Lists)"
    p1.font.name = FONT_SANS
    p1.font.size = Pt(12)
    p1.font.bold = True
    p1.font.color.rgb = SKY_LIGHT
    p2 = tf_l.add_paragraph()
    p2.text = "Have a single, natural sequential path: Index 0 → 1 → 2 ... → (n-1). There is never any ambiguity about which element comes next."
    p2.font.name = FONT_SANS
    p2.font.size = Pt(10.5)
    p2.font.color.rgb = TEXT_MUTED

    add_card(slide, 1.1, 3.8, 5.2, 1.05, fill_color=SURFACE_INNER, border_color=INNER_BORDER)
    tb_tree = slide.shapes.add_textbox(Inches(1.2), Inches(3.85), Inches(5.0), Inches(0.95))
    tf_t = tb_tree.text_frame
    tf_t.word_wrap = True
    pt1 = tf_t.paragraphs[0]
    pt1.text = "2. Hierarchical Trees (2D Branching)"
    pt1.font.name = FONT_SANS
    pt1.font.size = Pt(12)
    pt1.font.bold = True
    pt1.font.color.rgb = AMBER
    pt2 = tf_t.add_paragraph()
    pt2.text = "Branch in multiple directions! At node A, do we inspect A first? Or go left to B? Or jump down to D? No single default sequence exists."
    pt2.font.name = FONT_SANS
    pt2.font.size = Pt(10.5)
    pt2.font.color.rgb = TEXT_MUTED

    add_card(slide, 1.1, 5.0, 5.2, 1.6, fill_color=EMERALD_BG, border_color=EMERALD, border_width=1.5)
    tb_call = slide.shapes.add_textbox(Inches(1.25), Inches(5.1), Inches(4.9), Inches(1.4))
    ctf = tb_call.text_frame
    ctf.word_wrap = True
    cp1 = ctf.paragraphs[0]
    cp1.text = "KEY TAKEAWAY"
    cp1.font.name = FONT_CODE
    cp1.font.size = Pt(10)
    cp1.font.bold = True
    cp1.font.color.rgb = EMERALD_LIGHT
    cp2 = ctf.add_paragraph()
    cp2.text = "Traversal provides formal deterministic strategies to convert a complex 2D hierarchy into a predictable 1D sequence for processing, searching, and computation."
    cp2.font.name = FONT_SANS
    cp2.font.size = Pt(11)
    cp2.font.color.rgb = TEXT_WHITE

    # Right Container: Question Visual
    add_card(slide, 6.9, 1.95, 5.6, 4.95, fill_color=SURFACE_INNER)

    q_title = slide.shapes.add_textbox(Inches(7.2), Inches(2.15), Inches(5.0), Inches(0.5))
    q_tf = q_title.text_frame
    q_tf.word_wrap = True
    qp = q_tf.paragraphs[0]
    qp.text = "How Should We Visit These Nodes?"
    qp.font.name = FONT_SANS
    qp.font.size = Pt(17)
    qp.font.bold = True
    qp.font.color.rgb = TEXT_WHITE

    # Placed higher so D and E clear the bottom choice boxes
    draw_tree_canonical(slide, root_x=9.7, root_y=2.95, node_size=0.62, scale_x=1.05, scale_y=0.88)

    qp1 = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.3), Inches(5.35), Inches(4.8), Inches(0.48))
    qp1.fill.solid()
    qp1.fill.fore_color.rgb = SURFACE_COLOR
    qp1.line.color.rgb = INNER_BORDER
    qp1.text_frame.paragraphs[0].text = "Choice 1: Process root A first? (Preorder)"
    qp1.text_frame.paragraphs[0].font.name = FONT_CODE
    qp1.text_frame.paragraphs[0].font.size = Pt(10)
    qp1.text_frame.paragraphs[0].font.color.rgb = SKY_LIGHT

    qp2 = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.3), Inches(5.98), Inches(4.8), Inches(0.48))
    qp2.fill.solid()
    qp2.fill.fore_color.rgb = SURFACE_COLOR
    qp2.line.color.rgb = INNER_BORDER
    qp2.text_frame.paragraphs[0].text = "Choice 2: Process left branch before A? (Inorder)"
    qp2.text_frame.paragraphs[0].font.name = FONT_CODE
    qp2.text_frame.paragraphs[0].font.size = Pt(10)
    qp2.text_frame.paragraphs[0].font.color.rgb = EMERALD_LIGHT


def build_slide_3(prs):
    """Slide 3 — What is a Binary Tree? Anatomy & Components"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(slide, "CORE DATA STRUCTURE PREREQUISITES", "Anatomy of a Binary Tree",
               "Essential hierarchical terminology, recursive composition, and structural constraints")

    # Left Container: Large Annotated Tree Diagram
    add_card(slide, 0.8, 1.95, 6.6, 4.95, fill_color=SURFACE_INNER)

    tb_diag = slide.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(6.2), Inches(0.4))
    tb_diag.text_frame.paragraphs[0].text = "Structural Hierarchy & Labeled Components"
    tb_diag.text_frame.paragraphs[0].font.name = FONT_SANS
    tb_diag.text_frame.paragraphs[0].font.size = Pt(15)
    tb_diag.text_frame.paragraphs[0].font.bold = True
    tb_diag.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    # Draw Canonical Tree with precise scale
    draw_tree_canonical(slide, root_x=4.1, root_y=3.05, node_size=0.64, scale_x=1.15, scale_y=0.92)

    # Callout badge for Root A (placed neatly above-right of A)
    b_root = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.7), Inches(2.55), Inches(2.3), Inches(0.38))
    b_root.fill.solid()
    b_root.fill.fore_color.rgb = AMBER_BG
    b_root.line.color.rgb = AMBER
    b_root.line.width = Pt(1.2)
    b_root.text_frame.paragraphs[0].text = "← Root Node (Entry Point)"
    b_root.text_frame.paragraphs[0].font.name = FONT_CODE
    b_root.text_frame.paragraphs[0].font.size = Pt(9.2)
    b_root.text_frame.paragraphs[0].font.bold = True
    b_root.text_frame.paragraphs[0].font.color.rgb = AMBER

    # Callout badge for Parent B (placed cleanly to the left of B)
    b_par = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.95), Inches(3.85), Inches(1.35), Inches(0.38))
    b_par.fill.solid()
    b_par.fill.fore_color.rgb = SKY_BG
    b_par.line.color.rgb = SKY
    b_par.line.width = Pt(1.2)
    b_par.text_frame.paragraphs[0].text = "Parent (B) →"
    b_par.text_frame.paragraphs[0].font.name = FONT_CODE
    b_par.text_frame.paragraphs[0].font.size = Pt(9.2)
    b_par.text_frame.paragraphs[0].font.bold = True
    b_par.text_frame.paragraphs[0].font.color.rgb = SKY_LIGHT

    # Callout badge for Leaves D, E, C (placed across bottom with generous clearance)
    b_leaf = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(5.95), Inches(4.8), Inches(0.42))
    b_leaf.fill.solid()
    b_leaf.fill.fore_color.rgb = EMERALD_BG
    b_leaf.line.color.rgb = EMERALD
    b_leaf.line.width = Pt(1.2)
    b_leaf.text_frame.paragraphs[0].text = "↑ Leaf Nodes (D, E, C: Nodes with zero children)"
    b_leaf.text_frame.paragraphs[0].font.name = FONT_CODE
    b_leaf.text_frame.paragraphs[0].font.size = Pt(9.5)
    b_leaf.text_frame.paragraphs[0].font.bold = True
    b_leaf.text_frame.paragraphs[0].font.color.rgb = EMERALD_LIGHT

    # Right Container: 3 Concise Concept Cards
    add_card(slide, 7.6, 1.95, 4.9, 4.95)

    concepts = [
        ("1. At Most Two Children",
         "In a Binary Tree, each node has at most two child nodes, designated specifically as the 'left child' and 'right child'.",
         SKY_LIGHT),
        ("2. Recursive Subtree Principle",
         "Every node in the tree is itself the root of its own smaller binary tree (left subtree and right subtree). Algorithms naturally leverage recursion.",
         EMERALD_LIGHT),
        ("3. Height & Depth",
         "Depth of a node is the number of edges from the root. Tree height (h) is the maximum depth across all nodes (here h = 3).",
         AMBER)
    ]

    top_pos = 2.15
    for title, desc, col in concepts:
        add_card(slide, 7.8, top_pos, 4.5, 1.35, fill_color=SURFACE_INNER, border_color=INNER_BORDER)
        tb = slide.shapes.add_textbox(Inches(7.95), Inches(top_pos + 0.1), Inches(4.2), Inches(1.15))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.name = FONT_SANS
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = col

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = FONT_SANS
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = TEXT_MUTED
        top_pos += 1.5


def build_slide_4(prs):
    """Slide 4 — What is Tree Traversal? Formal Definition & 3 DFS Variants"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(slide, "FORMAL DEFINITION & STRATEGIES", "What is Tree Traversal?",
               "Systematic exploration: visiting every node exactly once without omissions or loops")

    def_card = add_card(slide, 0.8, 1.95, 11.733, 1.15, fill_color=SURFACE_COLOR, border_color=EMERALD, border_width=1.5)
    tb_def = slide.shapes.add_textbox(Inches(1.0), Inches(2.05), Inches(11.3), Inches(0.95))
    tf_def = tb_def.text_frame
    tf_def.word_wrap = True
    dp1 = tf_def.paragraphs[0]
    dp1.text = "CORE DEFINITION"
    dp1.font.name = FONT_CODE
    dp1.font.size = Pt(10)
    dp1.font.bold = True
    dp1.font.color.rgb = EMERALD_LIGHT

    dp2 = tf_def.add_paragraph()
    dp2.text = "Tree Traversal is the systematic process of visiting (reading, modifying, or printing) every single node in a tree data structure exactly once, following a strict predefined order."
    dp2.font.name = FONT_SANS
    dp2.font.size = Pt(13.5)
    dp2.font.bold = True
    dp2.font.color.rgb = TEXT_WHITE

    col_w = 3.65
    gap = 0.38
    lefts = [0.8, 0.8 + col_w + gap, 0.8 + 2 * (col_w + gap)]

    strategies = [
        ("INORDER", "Left → Root → Right", "L - N - R", EMERALD, EMERALD_BG,
         "Processes the left subtree first, visits the current root node, then processes the right subtree.\n\nKey: Root is processed in the middle."),
        ("PREORDER", "Root → Left → Right", "N - L - R", SKY, SKY_BG,
         "Visits the current root node first, then recursively traverses the left subtree, followed by the right.\n\nKey: Root is processed first."),
        ("POSTORDER", "Left → Right → Root", "L - R - N", PURPLE, PURPLE_BG,
         "Recursively finishes the entire left subtree and right subtree before finally visiting the root node.\n\nKey: Root is processed last.")
    ]

    for idx, (name, rule, acronym, acc_col, bg_col, text_body) in enumerate(strategies):
        card_l = lefts[idx]
        add_card(slide, card_l, 3.3, col_w, 3.25, fill_color=SURFACE_COLOR, border_color=acc_col, border_width=1.5)

        htag = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(card_l + 0.25), Inches(3.5), Inches(col_w - 0.5), Inches(0.38))
        htag.fill.solid()
        htag.fill.fore_color.rgb = bg_col
        htag.line.color.rgb = acc_col
        htag.line.width = Pt(1.2)
        htag.text_frame.paragraphs[0].text = f"{name} ({acronym})"
        htag.text_frame.paragraphs[0].font.name = FONT_CODE
        htag.text_frame.paragraphs[0].font.size = Pt(11)
        htag.text_frame.paragraphs[0].font.bold = True
        htag.text_frame.paragraphs[0].font.color.rgb = acc_col
        htag.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

        tb_rule = slide.shapes.add_textbox(Inches(card_l + 0.25), Inches(4.0), Inches(col_w - 0.5), Inches(0.45))
        rtf = tb_rule.text_frame
        rp = rtf.paragraphs[0]
        rp.text = rule
        rp.font.name = FONT_SANS
        rp.font.size = Pt(14)
        rp.font.bold = True
        rp.font.color.rgb = TEXT_WHITE
        rp.alignment = PP_ALIGN.CENTER

        tb_b = slide.shapes.add_textbox(Inches(card_l + 0.25), Inches(4.6), Inches(col_w - 0.5), Inches(1.8))
        btf = tb_b.text_frame
        btf.word_wrap = True
        bp = btf.paragraphs[0]
        bp.text = text_body
        bp.font.name = FONT_SANS
        bp.font.size = Pt(10.5)
        bp.font.color.rgb = TEXT_MUTED

    rule_bar = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.7), Inches(11.733), Inches(0.42))
    rule_bar.fill.solid()
    rule_bar.fill.fore_color.rgb = SURFACE_INNER
    rule_bar.line.color.rgb = INNER_BORDER
    rbtf = rule_bar.text_frame
    rbtf.vertical_anchor = MSO_ANCHOR.MIDDLE
    rbp = rbtf.paragraphs[0]
    rbp.text = "UNIVERSAL DEPTH-FIRST RULE: In all three traversals, Left Subtree is visited before Right Subtree. The ONLY differentiator is when ROOT is visited."
    rbp.font.name = FONT_CODE
    rbp.font.size = Pt(9.5)
    rbp.font.bold = True
    rbp.font.color.rgb = AMBER
    rbp.alignment = PP_ALIGN.CENTER


def build_slide_5(prs):
    """Slide 5 — Inorder Traversal Walkthrough"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(slide, "DEPTH-FIRST TRAVERSAL 1 OF 3", "Inorder Traversal: Left → Root → Right",
               "Recursively traverse the left branch, evaluate current node, then traverse right branch",
               accent_color=EMERALD)

    add_card(slide, 0.8, 1.95, 5.8, 4.95, fill_color=SURFACE_INNER)

    tb_th = slide.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(5.4), Inches(0.4))
    tb_th.text_frame.paragraphs[0].text = "Execution Order Badges (1 to 5)"
    tb_th.text_frame.paragraphs[0].font.name = FONT_SANS
    tb_th.text_frame.paragraphs[0].font.size = Pt(15)
    tb_th.text_frame.paragraphs[0].font.bold = True
    tb_th.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    # Root elevated to 2.85 with scale_y=0.86 to ensure zero overlap with bottom chips
    inorder_steps = {'D': 1, 'B': 2, 'E': 3, 'A': 4, 'C': 5}
    draw_tree_canonical(slide, root_x=3.7, root_y=2.85, step_numbers=inorder_steps, active_color=EMERALD, node_size=0.64, scale_x=1.1, scale_y=0.88)

    add_sequence_chips(slide, left=1.25, top=5.85, sequence_items=['D', 'B', 'E', 'A', 'C'], accent_color=EMERALD, chip_w=0.58, gap=0.35)

    add_card(slide, 6.9, 1.95, 5.6, 4.95)

    tb_sh = slide.shapes.add_textbox(Inches(7.1), Inches(2.1), Inches(5.2), Inches(0.4))
    tb_sh.text_frame.paragraphs[0].text = "Step-by-Step Chronological Trace"
    tb_sh.text_frame.paragraphs[0].font.name = FONT_SANS
    tb_sh.text_frame.paragraphs[0].font.size = Pt(15)
    tb_sh.text_frame.paragraphs[0].font.bold = True
    tb_sh.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    steps = [
        ("Step 1: Node D", "Descend left from A → B → D. D has no left child, so VISIT(D).", EMERALD_LIGHT),
        ("Step 2: Node B", "Backtrack from left child D to parent B. VISIT(B).", TEXT_WHITE),
        ("Step 3: Node E", "Explore right child of B. E is a leaf, so VISIT(E). Left subtree of A complete!", TEXT_WHITE),
        ("Step 4: Node A (Root)", "Entire left branch (D, B, E) finished! Backtrack to root A. VISIT(A).", AMBER),
        ("Step 5: Node C", "Explore right branch of A. Move to node C. VISIT(C). Traversal complete!", TEXT_WHITE)
    ]

    t_pos = 2.6
    for title, desc, col in steps:
        add_card(slide, 7.1, t_pos, 5.2, 0.65, fill_color=SURFACE_INNER, border_color=INNER_BORDER)
        tb = slide.shapes.add_textbox(Inches(7.2), Inches(t_pos + 0.05), Inches(5.0), Inches(0.55))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.name = FONT_CODE
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = FONT_SANS
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_MUTED
        t_pos += 0.74

    c_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.1), Inches(6.35), Inches(5.2), Inches(0.42))
    c_box.fill.solid()
    c_box.fill.fore_color.rgb = EMERALD_BG
    c_box.line.color.rgb = EMERALD
    c_box.line.width = Pt(1.2)
    c_box.text_frame.paragraphs[0].text = "CORE PROPERTY: Root A is processed in the middle (4th of 5 nodes)."
    c_box.text_frame.paragraphs[0].font.name = FONT_CODE
    c_box.text_frame.paragraphs[0].font.size = Pt(9.5)
    c_box.text_frame.paragraphs[0].font.bold = True
    c_box.text_frame.paragraphs[0].font.color.rgb = EMERALD_LIGHT
    c_box.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER


def build_slide_6(prs):
    """Slide 6 — Inorder Algorithm & Recursive Logic"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(slide, "ALGORITHM SPECIFICATION", "Inorder Recursive Algorithm",
               "Recursive call structure, base condition, and sorted BST property",
               accent_color=EMERALD)

    code_lines = [
        "function INORDER(node):",
        "    if node == NULL:        // Base Case",
        "        return",
        "",
        "    INORDER(node.left)      // 1. Recurse Left Subtree",
        "    VISIT(node)             // 2. Process Current Node",
        "    INORDER(node.right)     // 3. Recurse Right Subtree",
        "    return"
    ]
    add_code_block(slide, left=0.8, top=1.95, width=5.6, height=4.95, lines=code_lines, title="INORDER RECURSIVE PSEUDOCODE")

    add_card(slide, 6.7, 1.95, 5.8, 4.95)

    tb_rh = slide.shapes.add_textbox(Inches(6.9), Inches(2.1), Inches(5.4), Inches(0.4))
    tb_rh.text_frame.paragraphs[0].text = "Execution Flow & Unique Properties"
    tb_rh.text_frame.paragraphs[0].font.name = FONT_SANS
    tb_rh.text_frame.paragraphs[0].font.size = Pt(15)
    tb_rh.text_frame.paragraphs[0].font.bold = True
    tb_rh.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    flow_items = [
        ("1. Left Recursion First", "The function dives down node.left continuously until it hits NULL. Execution at parent frames pauses on the call stack."),
        ("2. Visit Upon Backtracking", "When the left child returns, VISIT(node) executes. This is where output is printed, stored, or modified."),
        ("3. Right Recursion After Visit", "Only after the node itself is processed does the algorithm branch down node.right.")
    ]

    cur_top = 2.6
    for title, desc in flow_items:
        add_card(slide, 6.9, cur_top, 5.4, 0.72, fill_color=SURFACE_INNER, border_color=INNER_BORDER)
        tb = slide.shapes.add_textbox(Inches(7.05), Inches(cur_top + 0.05), Inches(5.1), Inches(0.62))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.name = FONT_CODE
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = EMERALD_LIGHT
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = FONT_SANS
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_MUTED
        cur_top += 0.84

    add_card(slide, 6.9, 5.15, 5.4, 1.6, fill_color=EMERALD_BG, border_color=EMERALD, border_width=1.5)
    tb_bst = slide.shapes.add_textbox(Inches(7.05), Inches(5.25), Inches(5.1), Inches(1.4))
    btf = tb_bst.text_frame
    btf.word_wrap = True
    bp1 = btf.paragraphs[0]
    bp1.text = "BST SUPERPOWER: SORTED ORDER"
    bp1.font.name = FONT_CODE
    bp1.font.size = Pt(10.5)
    bp1.font.bold = True
    bp1.font.color.rgb = EMERALD_LIGHT

    bp2 = btf.add_paragraph()
    bp2.text = "In a Binary Search Tree (BST), where Left < Root < Right, Inorder traversal guarantees visiting keys in strictly non-decreasing (sorted) order in O(n) time, eliminating the need for an external sort algorithm!"
    bp2.font.name = FONT_SANS
    bp2.font.size = Pt(10.5)
    bp2.font.color.rgb = TEXT_WHITE


def build_slide_7(prs):
    """Slide 7 — Preorder Traversal Walkthrough"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(slide, "DEPTH-FIRST TRAVERSAL 2 OF 3", "Preorder Traversal: Root → Left → Right",
               "Visit the current root node first before descending down into child subtrees",
               accent_color=SKY)

    add_card(slide, 0.8, 1.95, 5.8, 4.95, fill_color=SURFACE_INNER)

    tb_th = slide.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(5.4), Inches(0.4))
    tb_th.text_frame.paragraphs[0].text = "Execution Order Badges (1 to 5)"
    tb_th.text_frame.paragraphs[0].font.name = FONT_SANS
    tb_th.text_frame.paragraphs[0].font.size = Pt(15)
    tb_th.text_frame.paragraphs[0].font.bold = True
    tb_th.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    preorder_steps = {'A': 1, 'B': 2, 'D': 3, 'E': 4, 'C': 5}
    draw_tree_canonical(slide, root_x=3.7, root_y=2.85, step_numbers=preorder_steps, active_color=SKY, node_size=0.64, scale_x=1.1, scale_y=0.88)

    add_sequence_chips(slide, left=1.25, top=5.85, sequence_items=['A', 'B', 'D', 'E', 'C'], accent_color=SKY, chip_w=0.58, gap=0.35)

    add_card(slide, 6.9, 1.95, 5.6, 4.95)

    tb_sh = slide.shapes.add_textbox(Inches(7.1), Inches(2.1), Inches(5.2), Inches(0.4))
    tb_sh.text_frame.paragraphs[0].text = "Step-by-Step Chronological Trace"
    tb_sh.text_frame.paragraphs[0].font.name = FONT_SANS
    tb_sh.text_frame.paragraphs[0].font.size = Pt(15)
    tb_sh.text_frame.paragraphs[0].font.bold = True
    tb_sh.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    steps = [
        ("Step 1: Node A (Root)", "Immediately VISIT(A) before exploring any subtrees!", SKY_LIGHT),
        ("Step 2: Node B", "Descend left from A to B. Immediately VISIT(B) as subtree root.", TEXT_WHITE),
        ("Step 3: Node D", "Descend left from B to D. Immediately VISIT(D). D is leaf (returns).", TEXT_WHITE),
        ("Step 4: Node E", "Move to right child of B. Immediately VISIT(E). Entire B branch complete!", TEXT_WHITE),
        ("Step 5: Node C", "Backtrack up to A and move to right child. Immediately VISIT(C). Complete!", TEXT_WHITE)
    ]

    t_pos = 2.6
    for title, desc, col in steps:
        add_card(slide, 7.1, t_pos, 5.2, 0.65, fill_color=SURFACE_INNER, border_color=INNER_BORDER)
        tb = slide.shapes.add_textbox(Inches(7.2), Inches(t_pos + 0.05), Inches(5.0), Inches(0.55))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.name = FONT_CODE
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = FONT_SANS
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_MUTED
        t_pos += 0.74

    c_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.1), Inches(6.35), Inches(5.2), Inches(0.42))
    c_box.fill.solid()
    c_box.fill.fore_color.rgb = SKY_BG
    c_box.line.color.rgb = SKY
    c_box.line.width = Pt(1.2)
    c_box.text_frame.paragraphs[0].text = "CORE PROPERTY: Root A is processed first (1st of 5 nodes)."
    c_box.text_frame.paragraphs[0].font.name = FONT_CODE
    c_box.text_frame.paragraphs[0].font.size = Pt(9.5)
    c_box.text_frame.paragraphs[0].font.bold = True
    c_box.text_frame.paragraphs[0].font.color.rgb = SKY_LIGHT
    c_box.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER


def build_slide_8(prs):
    """Slide 8 — Preorder Algorithm & Logic"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(slide, "ALGORITHM SPECIFICATION", "Preorder Recursive Algorithm",
               "Top-down inspection, hierarchical preservation, and structure serialization",
               accent_color=SKY)

    code_lines = [
        "function PREORDER(node):",
        "    if node == NULL:        // Base Case",
        "        return",
        "",
        "    VISIT(node)             // 1. Process Current Node First",
        "    PREORDER(node.left)     // 2. Recurse Left Subtree",
        "    PREORDER(node.right)    // 3. Recurse Right Subtree",
        "    return"
    ]
    add_code_block(slide, left=0.8, top=1.95, width=5.6, height=4.95, lines=code_lines, title="PREORDER RECURSIVE PSEUDOCODE")

    add_card(slide, 6.7, 1.95, 5.8, 4.95)

    tb_rh = slide.shapes.add_textbox(Inches(6.9), Inches(2.1), Inches(5.4), Inches(0.4))
    tb_rh.text_frame.paragraphs[0].text = "Execution Flow & Practical Strengths"
    tb_rh.text_frame.paragraphs[0].font.name = FONT_SANS
    tb_rh.text_frame.paragraphs[0].font.size = Pt(15)
    tb_rh.text_frame.paragraphs[0].font.bold = True
    tb_rh.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    flow_items = [
        ("1. Visit Happens First", "Unlike Inorder, the current node is visited before any recursive calls are initiated. It models top-down parent-first traversal."),
        ("2. Depth-First Left Descent", "After visiting the node, the call stack dives down the left subtree to completion."),
        ("3. Depth-First Right Descent", "Finally, right branches are processed after left siblings finish.")
    ]

    cur_top = 2.6
    for title, desc in flow_items:
        add_card(slide, 6.9, cur_top, 5.4, 0.72, fill_color=SURFACE_INNER, border_color=INNER_BORDER)
        tb = slide.shapes.add_textbox(Inches(7.05), Inches(cur_top + 0.05), Inches(5.1), Inches(0.62))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.name = FONT_CODE
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = SKY_LIGHT
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = FONT_SANS
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_MUTED
        cur_top += 0.84

    add_card(slide, 6.9, 5.15, 5.4, 1.6, fill_color=SKY_BG, border_color=SKY, border_width=1.5)
    tb_bst = slide.shapes.add_textbox(Inches(7.05), Inches(5.25), Inches(5.1), Inches(1.4))
    btf = tb_bst.text_frame
    btf.word_wrap = True
    bp1 = btf.paragraphs[0]
    bp1.text = "PRIMARY USE: TREE CLONING & SERIALIZATION"
    bp1.font.name = FONT_CODE
    bp1.font.size = Pt(10.5)
    bp1.font.bold = True
    bp1.font.color.rgb = SKY_LIGHT

    bp2 = btf.add_paragraph()
    bp2.text = "Because parent nodes appear before their respective children in the output sequence, Preorder is the standard traversal used to clone/duplicate trees or serialize a tree to disk/JSON so it can be re-constructed accurately!"
    bp2.font.name = FONT_SANS
    bp2.font.size = Pt(10.5)
    bp2.font.color.rgb = TEXT_WHITE


def build_slide_9(prs):
    """Slide 9 — Postorder Traversal Walkthrough"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(slide, "DEPTH-FIRST TRAVERSAL 3 OF 3", "Postorder Traversal: Left → Right → Root",
               "Resolve all descendants and child subtrees before processing the parent root node",
               accent_color=PURPLE)

    add_card(slide, 0.8, 1.95, 5.8, 4.95, fill_color=SURFACE_INNER)

    tb_th = slide.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(5.4), Inches(0.4))
    tb_th.text_frame.paragraphs[0].text = "Execution Order Badges (1 to 5)"
    tb_th.text_frame.paragraphs[0].font.name = FONT_SANS
    tb_th.text_frame.paragraphs[0].font.size = Pt(15)
    tb_th.text_frame.paragraphs[0].font.bold = True
    tb_th.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    postorder_steps = {'D': 1, 'E': 2, 'B': 3, 'C': 4, 'A': 5}
    draw_tree_canonical(slide, root_x=3.7, root_y=2.85, step_numbers=postorder_steps, active_color=PURPLE, node_size=0.64, scale_x=1.1, scale_y=0.88)

    add_sequence_chips(slide, left=1.25, top=5.85, sequence_items=['D', 'E', 'B', 'C', 'A'], accent_color=PURPLE, chip_w=0.58, gap=0.35)

    add_card(slide, 6.9, 1.95, 5.6, 4.95)

    tb_sh = slide.shapes.add_textbox(Inches(7.1), Inches(2.1), Inches(5.2), Inches(0.4))
    tb_sh.text_frame.paragraphs[0].text = "Step-by-Step Chronological Trace"
    tb_sh.text_frame.paragraphs[0].font.name = FONT_SANS
    tb_sh.text_frame.paragraphs[0].font.size = Pt(15)
    tb_sh.text_frame.paragraphs[0].font.bold = True
    tb_sh.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    steps = [
        ("Step 1: Node D", "Dive left to bottom leaf D. Left & right are NULL → VISIT(D).", PURPLE_LIGHT),
        ("Step 2: Node E", "Parent B must finish right child before B can be visited! VISIT(E).", TEXT_WHITE),
        ("Step 3: Node B", "Both children of B (D & E) are now fully finished! VISIT(B).", TEXT_WHITE),
        ("Step 4: Node C", "Root A must finish right child C before A can be visited! VISIT(C).", TEXT_WHITE),
        ("Step 5: Node A (Root)", "All subtrees in the entire tree are resolved. Finally VISIT(A)!", AMBER)
    ]

    t_pos = 2.6
    for title, desc, col in steps:
        add_card(slide, 7.1, t_pos, 5.2, 0.65, fill_color=SURFACE_INNER, border_color=INNER_BORDER)
        tb = slide.shapes.add_textbox(Inches(7.2), Inches(t_pos + 0.05), Inches(5.0), Inches(0.55))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.name = FONT_CODE
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = FONT_SANS
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_MUTED
        t_pos += 0.74

    c_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.1), Inches(6.35), Inches(5.2), Inches(0.42))
    c_box.fill.solid()
    c_box.fill.fore_color.rgb = PURPLE_BG
    c_box.line.color.rgb = PURPLE
    c_box.line.width = Pt(1.2)
    c_box.text_frame.paragraphs[0].text = "CORE PROPERTY: Root A is processed last (5th of 5 nodes)."
    c_box.text_frame.paragraphs[0].font.name = FONT_CODE
    c_box.text_frame.paragraphs[0].font.size = Pt(9.5)
    c_box.text_frame.paragraphs[0].font.bold = True
    c_box.text_frame.paragraphs[0].font.color.rgb = PURPLE_LIGHT
    c_box.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER


def build_slide_10(prs):
    """Slide 10 — Postorder Algorithm & Logic"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(slide, "ALGORITHM SPECIFICATION", "Postorder Recursive Algorithm",
               "Bottom-up dependency resolution, memory deallocation, and expression evaluation",
               accent_color=PURPLE)

    code_lines = [
        "function POSTORDER(node):",
        "    if node == NULL:        // Base Case",
        "        return",
        "",
        "    POSTORDER(node.left)    // 1. Recurse Left Subtree",
        "    POSTORDER(node.right)   // 2. Recurse Right Subtree",
        "    VISIT(node)             // 3. Process Current Node Last",
        "    return"
    ]
    add_code_block(slide, left=0.8, top=1.95, width=5.6, height=4.95, lines=code_lines, title="POSTORDER RECURSIVE PSEUDOCODE")

    add_card(slide, 6.7, 1.95, 5.8, 4.95)

    tb_rh = slide.shapes.add_textbox(Inches(6.9), Inches(2.1), Inches(5.4), Inches(0.4))
    tb_rh.text_frame.paragraphs[0].text = "Execution Flow & Bottom-Up Mechanics"
    tb_rh.text_frame.paragraphs[0].font.name = FONT_SANS
    tb_rh.text_frame.paragraphs[0].font.size = Pt(15)
    tb_rh.text_frame.paragraphs[0].font.bold = True
    tb_rh.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE

    flow_items = [
        ("1. Resolve Left Dependencies", "Recursively completes the left subproblem completely before any action at the current frame."),
        ("2. Resolve Right Dependencies", "Recursively completes the right subproblem. Both subtrees are now fully evaluated."),
        ("3. Process Parent Last", "Only when all descendants are accounted for is VISIT(node) called. Guarantees bottom-up computation.")
    ]

    cur_top = 2.6
    for title, desc in flow_items:
        add_card(slide, 6.9, cur_top, 5.4, 0.72, fill_color=SURFACE_INNER, border_color=INNER_BORDER)
        tb = slide.shapes.add_textbox(Inches(7.05), Inches(cur_top + 0.05), Inches(5.1), Inches(0.62))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.name = FONT_CODE
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = PURPLE_LIGHT
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = FONT_SANS
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_MUTED
        cur_top += 0.84

    add_card(slide, 6.9, 5.15, 5.4, 1.6, fill_color=PURPLE_BG, border_color=PURPLE, border_width=1.5)
    tb_bst = slide.shapes.add_textbox(Inches(7.05), Inches(5.25), Inches(5.1), Inches(1.4))
    btf = tb_bst.text_frame
    btf.word_wrap = True
    bp1 = btf.paragraphs[0]
    bp1.text = "CRUCIAL APPLICATION: SAFE DELETION & MEMORY FREEING"
    bp1.font.name = FONT_CODE
    bp1.font.size = Pt(10.5)
    bp1.font.bold = True
    bp1.font.color.rgb = PURPLE_LIGHT

    bp2 = btf.add_paragraph()
    bp2.text = "In languages with manual memory management (C, C++), deleting a parent node first destroys pointers to its children, causing orphan memory leaks. Postorder guarantees children are freed first before parent memory is deallocated!"
    bp2.font.name = FONT_SANS
    bp2.font.size = Pt(10.5)
    bp2.font.color.rgb = TEXT_WHITE


def build_slide_11(prs):
    """Slide 11 — Three Traversals, One Tree (Direct Multi-Column Comparison)"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(slide, "SYNCHRONIZED COMPARISON", "Three Traversals. One Tree.",
               "Direct side-by-side comparison on the identical 5-node canonical tree structure")

    col_w = 3.7
    gap = 0.31
    lefts = [0.8, 0.8 + col_w + gap, 0.8 + 2 * (col_w + gap)]

    columns_data = [
        {
            "name": "INORDER",
            "rule": "Left → Root → Right",
            "color": EMERALD,
            "bg": EMERALD_BG,
            "steps": {'D': 1, 'B': 2, 'E': 3, 'A': 4, 'C': 5},
            "sequence": "D → B → E → A → C",
            "root_pos": "Root (A) is in Middle (4th)",
            "use": "Produces sorted BST output"
        },
        {
            "name": "PREORDER",
            "rule": "Root → Left → Right",
            "color": SKY,
            "bg": SKY_BG,
            "steps": {'A': 1, 'B': 2, 'D': 3, 'E': 4, 'C': 5},
            "sequence": "A → B → D → E → C",
            "root_pos": "Root (A) is First (1st)",
            "use": "Serializes tree structure & clones"
        },
        {
            "name": "POSTORDER",
            "rule": "Left → Right → Root",
            "color": PURPLE,
            "bg": PURPLE_BG,
            "steps": {'D': 1, 'E': 2, 'B': 3, 'C': 4, 'A': 5},
            "sequence": "D → E → B → C → A",
            "root_pos": "Root (A) is Last (5th)",
            "use": "Safe bottom-up deallocation"
        }
    ]

    for idx, c in enumerate(columns_data):
        c_left = lefts[idx]
        add_card(slide, c_left, 1.95, col_w, 4.35, fill_color=SURFACE_COLOR, border_color=c["color"], border_width=1.5)

        hpill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(c_left + 0.2), Inches(2.08), Inches(col_w - 0.4), Inches(0.38))
        hpill.fill.solid()
        hpill.fill.fore_color.rgb = c["bg"]
        hpill.line.color.rgb = c["color"]
        hpill.text_frame.paragraphs[0].text = c["name"]
        hpill.text_frame.paragraphs[0].font.name = FONT_CODE
        hpill.text_frame.paragraphs[0].font.size = Pt(12)
        hpill.text_frame.paragraphs[0].font.bold = True
        hpill.text_frame.paragraphs[0].font.color.rgb = c["color"]
        hpill.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

        tb_r = slide.shapes.add_textbox(Inches(c_left + 0.2), Inches(2.50), Inches(col_w - 0.4), Inches(0.30))
        tb_r.text_frame.paragraphs[0].text = c["rule"]
        tb_r.text_frame.paragraphs[0].font.name = FONT_SANS
        tb_r.text_frame.paragraphs[0].font.size = Pt(11)
        tb_r.text_frame.paragraphs[0].font.bold = True
        tb_r.text_frame.paragraphs[0].font.color.rgb = TEXT_WHITE
        tb_r.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

        # Scaled and positioned with verified non-overlapping bounds
        center_x = c_left + (col_w / 2.0)
        draw_tree_canonical(slide, root_x=center_x, root_y=3.20, step_numbers=c["steps"], active_color=c["color"], node_size=0.40, scale_x=0.70, scale_y=0.46)

        add_card(slide, c_left + 0.2, 4.65, col_w - 0.4, 0.75, fill_color=SURFACE_INNER, border_color=INNER_BORDER)
        tb_out = slide.shapes.add_textbox(Inches(c_left + 0.25), Inches(4.68), Inches(col_w - 0.5), Inches(0.68))
        otf = tb_out.text_frame
        op1 = otf.paragraphs[0]
        op1.text = "OUTPUT SEQUENCE:"
        op1.font.name = FONT_CODE
        op1.font.size = Pt(8.5)
        op1.font.bold = True
        op1.font.color.rgb = TEXT_DIM
        op2 = otf.add_paragraph()
        op2.text = c["sequence"]
        op2.font.name = FONT_SANS
        op2.font.size = Pt(12)
        op2.font.bold = True
        op2.font.color.rgb = c["color"]

        tb_dist = slide.shapes.add_textbox(Inches(c_left + 0.2), Inches(5.55), Inches(col_w - 0.4), Inches(0.65))
        dtf = tb_dist.text_frame
        dtf.word_wrap = True
        dp1 = dtf.paragraphs[0]
        dp1.text = c["root_pos"]
        dp1.font.name = FONT_SANS
        dp1.font.size = Pt(10)
        dp1.font.bold = True
        dp1.font.color.rgb = AMBER
        dp2 = dtf.add_paragraph()
        dp2.text = c["use"]
        dp2.font.name = FONT_SANS
        dp2.font.size = Pt(9.5)
        dp2.font.color.rgb = TEXT_MUTED

    bot_card = add_card(slide, 0.8, 6.45, 11.733, 0.65, fill_color=SURFACE_INNER, border_color=AMBER, border_width=1.5)
    tb_trick = slide.shapes.add_textbox(Inches(1.0), Inches(6.5), Inches(11.3), Inches(0.55))
    ttf = tb_trick.text_frame
    tp = ttf.paragraphs[0]
    tp.text = "GOLDEN SEMINAR MEMORY RULE:     PRE  →  Root First      |      IN  →  Root in Between      |      POST  →  Root Last"
    tp.font.name = FONT_CODE
    tp.font.size = Pt(12.5)
    tp.font.bold = True
    tp.font.color.rgb = TEXT_WHITE
    tp.alignment = PP_ALIGN.CENTER


def build_slide_12(prs):
    """Slide 12 — Step-by-Step Matrix & Comparison Table"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(slide, "CROSS-ALGORITHM MATRIX", "Step-by-Step Traversal Comparison",
               "Synchronized evaluation matrix tracking node visits across identical algorithmic clocks")

    rows = 4
    cols = 8
    tbl_shape = slide.shapes.add_table(rows, cols, Inches(0.8), Inches(2.0), Inches(11.733), Inches(2.3))
    table = tbl_shape.table

    col_widths = [Inches(1.8), Inches(1.8), Inches(1.1), Inches(1.1), Inches(1.1), Inches(1.1), Inches(1.1), Inches(2.633)]
    for idx, width in enumerate(col_widths):
        table.columns[idx].width = width

    headers = ["Traversal", "Rule", "Step 1", "Step 2", "Step 3", "Step 4", "Step 5", "Root 'A' Position"]
    data = [
        ["Inorder", "Left → Root → Right", "D", "B", "E", "A (Root)", "C", "Middle (Index 3 / Step 4)"],
        ["Preorder", "Root → Left → Right", "A (Root)", "B", "D", "E", "C", "First (Index 0 / Step 1)"],
        ["Postorder", "Left → Right → Root", "D", "E", "B", "C", "A (Root)", "Last (Index 4 / Step 5)"]
    ]
    colors = [EMERALD_LIGHT, SKY_LIGHT, PURPLE_LIGHT]

    for col_idx, h_text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = SURFACE_INNER
        cell.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = cell.text_frame.paragraphs[0]
        p.text = h_text
        p.font.name = FONT_CODE
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = TEXT_MUTED
        p.alignment = PP_ALIGN.CENTER if col_idx >= 2 else PP_ALIGN.LEFT

    for row_idx, row_data in enumerate(data):
        row_color = colors[row_idx]
        for col_idx, cell_value in enumerate(row_data):
            cell = table.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = SURFACE_COLOR
            cell.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
            p = cell.text_frame.paragraphs[0]
            p.text = cell_value
            p.font.name = FONT_SANS
            p.font.size = Pt(11)
            p.font.bold = (col_idx == 0 or "Root" in cell_value)

            if col_idx == 0:
                p.font.color.rgb = row_color
                p.font.bold = True
            elif "Root" in cell_value:
                p.font.color.rgb = AMBER
                p.font.bold = True
            else:
                p.font.color.rgb = TEXT_WHITE

            p.alignment = PP_ALIGN.CENTER if (1 <= col_idx <= 6) else PP_ALIGN.LEFT

    col_w = 3.65
    gap = 0.38
    lefts = [0.8, 0.8 + col_w + gap, 0.8 + 2 * (col_w + gap)]

    insights = [
        ("Left Subtree Always Precedes Right",
         "Notice that in ALL three traversals, nodes D and E (left subtree) are visited BEFORE node C (right subtree). DFS hierarchy is maintained.",
         SKY_LIGHT),
        ("Root is the Sole Variable",
         "The position of Root A shifts systematically: Preorder (Step 1) → Inorder (Step 4) → Postorder (Step 5). This dictates their respective applications.",
         EMERALD_LIGHT),
        ("Unique Tree Reconstruction",
         "Can we rebuild a binary tree from a traversal? Yes! Inorder combined with Preorder OR Postorder guarantees 100% unique tree reconstruction.",
         PURPLE_LIGHT)
    ]

    for idx, (title, desc, col) in enumerate(insights):
        card_l = lefts[idx]
        add_card(slide, card_l, 4.65, col_w, 2.3, fill_color=SURFACE_INNER, border_color=INNER_BORDER)
        tb = slide.shapes.add_textbox(Inches(card_l + 0.2), Inches(4.8), Inches(col_w - 0.4), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.name = FONT_SANS
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = FONT_SANS
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED


def build_slide_13(prs):
    """Slide 13 — Time & Space Complexity (Balanced vs. Skewed)"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(slide, "ASYMPTOTIC ANALYSIS", "Time & Space Complexity",
               "Evaluating computational scaling and recursive call stack depth across tree topologies")

    # Time Metric Card
    add_card(slide, 0.8, 1.95, 5.7, 1.25, fill_color=SURFACE_COLOR, border_color=EMERALD, border_width=1.5)
    tb_time = slide.shapes.add_textbox(Inches(1.0), Inches(2.05), Inches(5.3), Inches(1.05))
    ttf = tb_time.text_frame
    ttf.word_wrap = True
    tp1 = ttf.paragraphs[0]
    tp1.text = "TIME COMPLEXITY: O(n)"
    tp1.font.name = FONT_CODE
    tp1.font.size = Pt(16)
    tp1.font.bold = True
    tp1.font.color.rgb = EMERALD_LIGHT

    tp2 = ttf.add_paragraph()
    tp2.text = "Every node is visited exactly once. At each node, a constant O(1) amount of work (checking null, printing) is done. Total runtime = O(n) where n = number of nodes."
    tp2.font.name = FONT_SANS
    tp2.font.size = Pt(10)
    tp2.font.color.rgb = TEXT_MUTED

    # Space Metric Card
    add_card(slide, 6.833, 1.95, 5.7, 1.25, fill_color=SURFACE_COLOR, border_color=SKY, border_width=1.5)
    tb_space = slide.shapes.add_textbox(Inches(7.033), Inches(2.05), Inches(5.3), Inches(1.05))
    stf = tb_space.text_frame
    stf.word_wrap = True
    sp1 = stf.paragraphs[0]
    sp1.text = "SPACE COMPLEXITY: O(h)"
    sp1.font.name = FONT_CODE
    sp1.font.size = Pt(16)
    sp1.font.bold = True
    sp1.font.color.rgb = SKY_LIGHT

    sp2 = stf.add_paragraph()
    sp2.text = "Auxiliary memory is consumed by the recursion call stack frames. The maximum number of active stack frames equals the tree height h. Thus space is O(h)."
    sp2.font.name = FONT_SANS
    sp2.font.size = Pt(10)
    sp2.font.color.rgb = TEXT_MUTED

    # Bottom Two Visual Topologies (Balanced vs. Skewed)
    # 1. Balanced Tree Card
    add_card(slide, 0.8, 3.4, 5.7, 3.5, fill_color=SURFACE_INNER)
    tb_bal = slide.shapes.add_textbox(Inches(1.0), Inches(3.55), Inches(5.3), Inches(0.4))
    tb_bal.text_frame.paragraphs[0].text = "BEST CASE: Balanced Tree (h = O(log n))"
    tb_bal.text_frame.paragraphs[0].font.name = FONT_CODE
    tb_bal.text_frame.paragraphs[0].font.size = Pt(12)
    tb_bal.text_frame.paragraphs[0].font.bold = True
    tb_bal.text_frame.paragraphs[0].font.color.rgb = EMERALD_LIGHT

    draw_tree_canonical(slide, root_x=3.65, root_y=4.05, node_size=0.44, scale_x=0.80, scale_y=0.60)

    tb_bal_desc = slide.shapes.add_textbox(Inches(1.0), Inches(5.95), Inches(5.3), Inches(0.8))
    bdtf = tb_bal_desc.text_frame
    bdtf.word_wrap = True
    bdp1 = bdtf.paragraphs[0]
    bdp1.text = "Height h = ⌊log₂ n⌋ + 1 ≈ 3 for 5 nodes. The recursive call stack never exceeds 3 frames deep. Optimal logarithmic memory footprint."
    bdp1.font.name = FONT_SANS
    bdp1.font.size = Pt(9.5)
    bdp1.font.color.rgb = TEXT_MUTED

    # 2. Skewed Tree Card
    add_card(slide, 6.833, 3.4, 5.7, 3.5, fill_color=SURFACE_INNER)
    tb_skew = slide.shapes.add_textbox(Inches(7.033), Inches(3.55), Inches(5.3), Inches(0.35))
    tb_skew.text_frame.paragraphs[0].text = "WORST CASE: Skewed Tree (h = O(n))"
    tb_skew.text_frame.paragraphs[0].font.name = FONT_CODE
    tb_skew.text_frame.paragraphs[0].font.size = Pt(12)
    tb_skew.text_frame.paragraphs[0].font.bold = True
    tb_skew.text_frame.paragraphs[0].font.color.rgb = AMBER

    skew_coords = [(8.35, 4.15), (8.75, 4.55), (9.15, 4.95), (9.55, 5.35)]
    skew_nodes = ['A', 'B', 'C', 'D']
    for i in range(len(skew_coords) - 1):
        x1, y1 = skew_coords[i]
        x2, y2 = skew_coords[i+1]
        line = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
        line.line.color.rgb = EDGE_LINE_COLOR
        line.line.width = Pt(2.0)

    for i, (sx, sy) in enumerate(skew_coords):
        circle = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(sx - 0.20), Inches(sy - 0.20), Inches(0.40), Inches(0.40))
        circle.fill.solid()
        circle.fill.fore_color.rgb = NODE_FILL_DEFAULT
        circle.line.color.rgb = AMBER
        circle.line.width = Pt(1.5)
        circle.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
        cp = circle.text_frame.paragraphs[0]
        cp.text = skew_nodes[i]
        cp.font.name = FONT_SANS
        cp.font.size = Pt(11)
        cp.font.bold = True
        cp.font.color.rgb = TEXT_WHITE
        cp.alignment = PP_ALIGN.CENTER

    tb_sk_desc = slide.shapes.add_textbox(Inches(7.033), Inches(5.95), Inches(5.3), Inches(0.8))
    sdtf = tb_sk_desc.text_frame
    sdtf.word_wrap = True
    sdp1 = sdtf.paragraphs[0]
    sdp1.text = "Tree degenerates into a Linked List where height h = n. Recursion stack consumes O(n) frames, risking stack overflow on large unbalanced trees."
    sdp1.font.name = FONT_SANS
    sdp1.font.size = Pt(9.5)
    sdp1.font.color.rgb = TEXT_MUTED


def build_slide_14(prs):
    """Slide 14 — Practical Applications & Live Demo Transition"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(slide, "INDUSTRY APPLICATIONS & LIVE DEMO", "Practical Applications & Interactive Demonstration",
               "When to use which traversal strategy in production software systems",
               accent_color=EMERALD)

    col_w = 3.65
    gap = 0.38
    lefts = [0.8, 0.8 + col_w + gap, 0.8 + 2 * (col_w + gap)]

    apps = [
        {
            "name": "INORDER USE CASES",
            "color": EMERALD,
            "items": [
                ("BST Sorted Extraction", "Yields elements in strictly non-decreasing order without secondary sorting overhead."),
                ("Infix Math Evaluation", "Transforms Abstract Syntax Trees (AST) into readable infix math expressions: (A + B) * C."),
                ("Tree Flattening", "Flattens binary search trees into sorted arrays or double linked lists.")
            ]
        },
        {
            "name": "PREORDER USE CASES",
            "color": SKY,
            "items": [
                ("Tree Cloning & Serialization", "Dumps tree structures to JSON or binary streams so they can be re-instantiated top-down."),
                ("Prefix Expression (Polish)", "Generates prefix notation (+ A B) for compilers and stack machines."),
                ("Directory Printing", "Renders hierarchical folder trees and file explorers with parent folders ahead of files.")
            ]
        },
        {
            "name": "POSTORDER USE CASES",
            "color": PURPLE,
            "items": [
                ("Safe Memory Freeing", "Ensures child subtrees are deallocated before freeing the parent in C/C++."),
                ("Postfix (Reverse Polish)", "Evaluates arithmetic parse trees from the bottom up (operands first, then operator)."),
                ("Directory Disk Usage", "Computes total folder disk space by summing child file sizes before reporting parent total.")
            ]
        }
    ]

    for idx, col_data in enumerate(apps):
        card_l = lefts[idx]
        add_card(slide, card_l, 1.95, col_w, 3.25, fill_color=SURFACE_COLOR, border_color=col_data["color"], border_width=1.5)

        hpill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(card_l + 0.2), Inches(2.1), Inches(col_w - 0.4), Inches(0.35))
        hpill.fill.solid()
        hpill.fill.fore_color.rgb = SURFACE_INNER
        hpill.line.color.rgb = col_data["color"]
        hpill.text_frame.paragraphs[0].text = col_data["name"]
        hpill.text_frame.paragraphs[0].font.name = FONT_CODE
        hpill.text_frame.paragraphs[0].font.size = Pt(10)
        hpill.text_frame.paragraphs[0].font.bold = True
        hpill.text_frame.paragraphs[0].font.color.rgb = col_data["color"]
        hpill.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

        cur_y = 2.55
        for title, desc in col_data["items"]:
            tb = slide.shapes.add_textbox(Inches(card_l + 0.2), Inches(cur_y), Inches(col_w - 0.4), Inches(0.8))
            tf = tb.text_frame
            tf.word_wrap = True
            p1 = tf.paragraphs[0]
            p1.text = f"• {title}"
            p1.font.name = FONT_SANS
            p1.font.size = Pt(10.5)
            p1.font.bold = True
            p1.font.color.rgb = TEXT_WHITE
            p2 = tf.add_paragraph()
            p2.text = desc
            p2.font.name = FONT_SANS
            p2.font.size = Pt(9.2)
            p2.font.color.rgb = TEXT_MUTED
            cur_y += 0.82

    demo_card = add_card(slide, 0.8, 5.4, 11.733, 1.55, fill_color=EMERALD_BG, border_color=EMERALD, border_width=2.0)

    tb_cta = slide.shapes.add_textbox(Inches(1.1), Inches(5.5), Inches(11.1), Inches(1.35))
    ctf = tb_cta.text_frame
    ctf.word_wrap = True

    cp1 = ctf.paragraphs[0]
    cp1.text = "ONE TREE. THREE WAYS TO SEE IT."
    cp1.font.name = FONT_CODE
    cp1.font.size = Pt(11)
    cp1.font.bold = True
    cp1.font.color.rgb = EMERALD_LIGHT

    cp2 = ctf.add_paragraph()
    cp2.text = "Let's Visualize It Live → Launching the Interactive Platform"
    cp2.font.name = FONT_SANS
    cp2.font.size = Pt(20)
    cp2.font.bold = True
    cp2.font.color.rgb = TEXT_WHITE

    cp3 = ctf.add_paragraph()
    cp3.text = "Switching to the interactive React visualizer to observe real-time step animations, call stack frames, synchronized pseudocode execution, and custom tree creation!"
    cp3.font.name = FONT_SANS
    cp3.font.size = Pt(11)
    cp3.font.color.rgb = RGBColor(200, 240, 220)


def generate_presentation(output_path="Tree_Traversals_Seminar_Presentation.pptx"):
    """Main presentation generator orchestrating all 14 slides."""
    print("Initializing PowerPoint Presentation...")
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    print("Building Slide 1: Title Slide...")
    build_slide_1(prs)
    print("Building Slide 2: Why Do We Need Traversal?...")
    build_slide_2(prs)
    print("Building Slide 3: What is a Binary Tree?...")
    build_slide_3(prs)
    print("Building Slide 4: What is Tree Traversal?...")
    build_slide_4(prs)
    print("Building Slide 5: Inorder Walkthrough...")
    build_slide_5(prs)
    print("Building Slide 6: Inorder Algorithm & BST Superpower...")
    build_slide_6(prs)
    print("Building Slide 7: Preorder Walkthrough...")
    build_slide_7(prs)
    print("Building Slide 8: Preorder Algorithm & Cloning...")
    build_slide_8(prs)
    print("Building Slide 9: Postorder Walkthrough...")
    build_slide_9(prs)
    print("Building Slide 10: Postorder Algorithm & Deallocation...")
    build_slide_10(prs)
    print("Building Slide 11: Three Traversals, One Tree...")
    build_slide_11(prs)
    print("Building Slide 12: Step-by-Step Traversal Comparison...")
    build_slide_12(prs)
    print("Building Slide 13: Time & Space Complexity...")
    build_slide_13(prs)
    print("Building Slide 14: Practical Applications & Live Demo...")
    build_slide_14(prs)

    prs.save(output_path)
    abs_path = os.path.abspath(output_path)
    print(f"Presentation successfully created at: {abs_path}")
    return abs_path


if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "Tree_Traversals_Seminar_Presentation.pptx"
    generate_presentation(out_file)
