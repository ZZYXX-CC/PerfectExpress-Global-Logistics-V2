---
name: Amodei Iterative Critique
description: A 4-step implementation system inspired by Anthropic's safety and alignment methodologies (Constitutional AI, Red Teaming). Enforces rigorous planning, execution, critique, and iteration.
---

# Amodei Iterative Critique System

This skill enforces a rigorous 4-step workflow for all significant feature implementations. It is designed to catch inconsistencies, ensure robustness, and align execution with high-level intent, mirroring the "Constitutional AI" and iterative refinement processes used in advanced AI research.

## The 4-Step Cycle

### 1. Plan & Specify (The "Constitution")
**Goal:** Define the "Constitution" for the feature—the exact requirements, constraints, and success criteria.
*   **Action:** Create or update the `implementation_plan.md`.
*   **Requirements:**
    *   **Goal Definition:** Precise statement of what the feature achieves.
    *   **Constraints:** What must *not* happen (e.g., performance regressions, security loopholes).
    *   **Test Cases:** Define the "Gold Standard" tests (input/output) before writing code.
    *   **User Approval:** Explicit user approval of the plan is required before moving to Step 2.

### 2. Implement (The "Model Response")
**Goal:** Generate the solution based strictly on the Plan.
*   **Action:** Write the code, create files, and modify existing logic.
*   **Guideline:** Focus on passing the "Test Cases" defined in Step 1. Do not optimize prematurely; focus on correctness and adherence to the plan.

### 3. Cross-Check & Critique (The "Red Team")
**Goal:** Critically analyze the implementation for flaws, side effects, and alignment gaps.
*   **Action:** Pause coding. Switch context to "Reviewer/Red Teamer".
*   **Critique Checklist:**
    *   **Gap Analysis:** Does the code actually fulfill the Plan?
    *   **Safety Check:** Are there security vulnerabilities or data leaks? (Check RLS, input validation).
    *   **Robustness:** What happens if inputs are malformed? (Edge cases).
    *   **Style/Consistency:** Does it match the existing design system (Perfect Express aesthetics)?
    *   **Inconsistencies:** Are there unused imports, dead code, or logic conflicts with other files?
*   **Output:** A bulleted "Critique Report" (can be internal or shared with user if significant).

### 4. Review & Replan (The "Refinement")
**Goal:** Synthesize critique findings and iterate.
*   **Action:**
    *   If **Minor Issues**: Fix them immediately (go to Step 2).
    *   If **Major Flaws**: Update the `implementation_plan.md` (go back to Step 1).
    *   If **Success**: Verify with final tests and seek user approval.
*   **Closure:** Ensure the "Task Summary" reflects the verified state.

## Usage Trigger
Use this skill when:
*   Starting a complex new feature (e.g., "Smart Contracts", "New Admin Dashboard").
*   Refactoring critical infrastructure.
*   The user explicitly asks to "do it carefully" or "follow the system".

## Tooling
*   Use `task_boundary` to strictly demarcate these phases (e.g., `TaskName: "Critique Phase: Admin Panel"`).
*   Use `implementation_plan.md` as the source of truth.
