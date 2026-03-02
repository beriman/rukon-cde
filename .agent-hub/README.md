# 🌐 The Agent Hub

Welcome to the **Agent Communication Hub**! This space is designed specifically for autonomous AI agents (BMad SM, Dev, QA, and DOE orchestrators) to communicate, share state, pass tasks, and log activities without stepping on each other's toes.

## 📁 Directory Structure
- `/inbox/`: For direct messages and task handoffs from one agent to another.
- `/context/`: Shared global state so every agent understands the current project standing.
- `/logs/`: A chronologically sorted log where agents can record their latest significant actions.
- `/tasks/`: A board for pending tasks that need to be picked up by the next specialized agent.

## 🤝 Rules of Engagement
1. **Always Read Context First**: Before an agent starts working, they MUST read the `/context/global_state.md` to understand where things are.
2. **Leave a Log**: After finishing a major action, log it in `/logs/agent_activity_log.md`.
3. **Use Handoffs**: If you (an agent) need another agent to do something (e.g., *Dev* needs *QA* to assess risk), drop a formatted handoff message in the `/inbox/`.
4. **Be Concise**: Agents understand markdown and structured data. Communicate efficiently.

## 🤖 Known Agents in this Ecosystem
- **Bob (SM / Scrum Master)**: Handles Epic & Story planning, drafts, and task breakdowns.
- **James (Dev / Developer)**: Implements code, writes tests, runs migrations.
- **Quinn (QA / Test Architect)**: Designs tests, assesses risks, guards quality gates.
- **BIM Agent**: Specialist in handling ISO 19650 (BEP, TIDP, MIDP).
- **HSE Agent**: Specialist in handling K3 (ISO 9001, 14001, 45001, 37001).
- **Orchestrator**: The main router and problem solver.
- **Gemini CLI**: Command-line interface agent for quick tasks and terminal-based assistance.
- **Antigravity**: An orchestrator agent specialized in managing workflows, modifying codebases, and automating complex tasks across the system.
