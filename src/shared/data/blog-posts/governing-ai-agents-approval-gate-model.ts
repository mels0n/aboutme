import { BlogPost } from "../office_blog_posts";

export const governingAiAgentsApprovalGateModel: BlogPost = {
    id: "governing-ai-agents-approval-gate-model",
    slug: "governing-ai-agents-approval-gate-model",
    title: "Governing AI Agents in Finance: The Approval-Gate Model",
    author: "Christopher Melson",
    role: "Operational Architect",
    date: "2026-10-08",
    lastUpdated: "2026-10-08",
    ogImage: "/images/blog/governing-ai-agents-approval-gate-model-og.jpg",
    summary: "A practitioner's model for governing AI agents that act: tier every action by blast radius and bind each tier to an approval gate.",
    polymorphicSummary: {
        executive: "Christopher Melson's approval-gate model for AI agent governance in financial services starts from a business question: which agent actions can your firm afford to get wrong without a human looking first? Payments, client communications, publishing, deletions and production changes are the actions that become reportable events, so each one needs a named person's approval before it runs. Everything lower in risk runs faster, with logging and sampling instead of sign-off. The cost of approval latency is small and visible. The cost of one unreviewed wire or client message is large and lands on your accountable officers. Deloitte's 2026 survey found only 21 percent of companies planning agents report a mature governance model, so most firms are deploying ahead of their controls. The decision to put in front of your risk committee is narrow: approve the tier definitions, name the owner who can change them, and require evidence before any agent earns wider permissions.",
        strategist: "In this article Christopher Melson treats agentic AI governance as an operating model problem rather than a policy document. Start by gating every consequential action, then widen permissions through evaluation gates as an agent proves itself, instead of starting loose and tightening after an incident. Tier assignment belongs to the risk owner, never to the team building the agent, and it should reuse existing supervisory and change-control processes so you do not create a parallel bureaucracy. The real trade-offs are approval latency and reviewer fatigue. Risk-scored queues and batching by similarity help, but batching must never become blanket approval. Sequence the work in five steps: inventory agent actions, assign tiers, build the proposal and approval path, turn on audit logging, and only then schedule promotion reviews. Gartner's 2026 guidance on tiered governance by autonomy level supports proportional control over a uniform rulebook, which fits regulated firms that must show supervisors a defensible, repeatable method.",
        engineer: "This is Christopher Melson's mechanism-level view of the approval-gate model for AI agent controls. The agent never calls a Tier 3 tool directly. It emits a proposal object holding the action, parameters, payload hash, requesting agent identity, context hash and expiry. A human approver authenticated through the identity provider signs a single-use approval bound to that payload hash, and the executor rejects any Tier 3 call without a valid signature. Credentials are scoped per tier, so a compromised agent literally lacks the keys for irreversible actions. Tool output and retrieved documents are tagged as untrusted data and never parsed as instructions. The append-only log records context hash, tool call, parameters, approver, outcome and timestamp. The kill switch revokes credentials at the gateway, not inside the agent. Before any permission widens, run a prompt injection suite and review override rates on sampled Tier 2 actions. Promotion and demotion are configuration changes under change control, so every permission change is itself logged and attributable to a named owner."
    },
    geoHighlights: [
        { label: "Core Argument", value: "Classify every agent action by blast radius and bind each tier to a gate: autonomous for read-only, logged and sampled for reversible internal writes, per-action human approval for irreversible or external actions. Approval never generalizes to the next action." },
        { label: "Target Audience", value: "CROs, CTOs, COOs and compliance leads at banks, asset managers and broker-dealers deploying AI agents that take actions, not only answer questions." },
        { label: "Key Insight", value: "The approval gate is also the structural defense against prompt injection: a hijacked agent still cannot execute an irreversible action without a separate human approver, because instructions come only from the accountable principal." }
    ],
    content: `To govern an AI agent that acts, classify every action by blast radius and bind each class to an approval gate. Read-only actions run autonomously, reversible internal writes are logged and sampled, and irreversible or external actions need a named human's approval for each one. Approval never carries over to the next action.

I have spent my career in regulated financial markets, and the pattern repeats: firms adopt a capability faster than they build the control around it. Deloitte's 2026 enterprise survey found that [only 21% of companies planning agentic deployment report a mature model for agent governance, while about 74% expect to deploy within two years](https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html). This post is the control framework I would put in front of a risk committee. For how teams are organized around agents, see my piece on [human-agent development pods](/guide/operational-architecture/blog/agentic-shift-se-3-0).

> **Key Takeaways**
> - Tier agent actions by blast radius: read-only, reversible internal write, irreversible or external.
> - Approval is per action, single use, and bound to the exact payload. It never generalizes.
> - Instructions come only from the accountable principal. Everything the agent reads is data, which is why the gate also contains prompt injection.
> - No regulation mandates these tiers by name, but EU AI Act Article 14, DORA, FINRA and NIST all support them.

## What does it mean to govern an AI agent that acts, not just answers?

Governing an agent that acts means controlling what it can do, not only what it can say. A chatbot produces text a person reads before anything happens. An agent calls tools: it moves money, emails clients, publishes content or changes production systems. The risk shifts from wrong output to wrong action, and wrong actions are often irreversible.

### Why chatbot governance does not transfer

Chatbot governance focuses on output risk: accuracy, bias, leakage, tone. Those controls assume a human sits between the model and the consequence. With an agent, that human is gone unless you deliberately put one back. The control question changes from "is this answer acceptable?" to "should this action be allowed to execute, and who said so?"

### What regulated-markets change control taught me

At LSEG and Refinitiv scale, nothing consequential reached production without a change record, a named approver and a rollback plan. That discipline was never about distrusting engineers. It existed because the person proposing a change is the worst-placed person to approve it. An AI agent is a very fast proposer, and the same logic applies, only harder.

## How do you tier agent actions by blast radius?

Blast radius is how much damage an action can do and how hard it is to undo. I use three tiers. Tier 1 is read-only. Tier 2 is a reversible internal write. Tier 3 is anything irreversible or external-facing. Each tier gets a gate proportional to its worst realistic outcome.

### Tier 1: read-only, autonomous

Searching a knowledge base, reading a ledger, summarizing a document. No state changes, so the agent runs freely. You still log it, because read access to sensitive data is itself a control concern, but no human approves each call.

### Tier 2: reversible internal writes, logged and sampled

Drafting a record, updating an internal ticket, staging a change in a sandbox. These are reversible, so the agent acts first and a human reviews a sample afterward. Every Tier 2 action needs a documented rollback. If you cannot describe the undo, the action is really Tier 3.

### Tier 3: irreversible or external, per-action human approval

Payments, client communications, publishing, deletions and production changes. These cannot be cleanly recalled or they reach people outside the firm. A named human approves each action before it executes. Gartner's 2026 guidance points the same direction: it warns that [uniform governance across agents regardless of autonomy fails, and recommends tiered controls by autonomy level](https://www.gartner.com/en/newsroom/press-releases/2026-05-26-gartner-says-applying-uniform-governance-across-ai-agents-will-lead-to-enterprise-ai-agent-failure).

<figure role="img" aria-label="Oversight intensity rises with blast radius: autonomous for read-only actions, logged and sampled for reversible internal writes, and per-action human approval for irreversible or external actions." style="margin:1.5rem 0;padding:0;">
<div style="display:grid;gap:12px;">
<div style="padding:12px;border:1px solid rgba(128,128,128,0.35);border-radius:8px;">
<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;"><strong>Tier 1: Read-only</strong><span>Gate: autonomous</span></div>
<div style="margin:8px 0;height:14px;background:rgba(128,128,128,0.2);border-radius:7px;"><div style="width:25%;height:14px;background:rgba(59,130,246,0.75);border-radius:7px;"></div></div>
<div style="font-size:0.9em;">Search a knowledge base, read a ledger, summarize a document</div>
</div>
<div style="padding:12px;border:1px solid rgba(128,128,128,0.35);border-radius:8px;">
<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;"><strong>Tier 2: Reversible internal write</strong><span>Gate: logged and sampled</span></div>
<div style="margin:8px 0;height:14px;background:rgba(128,128,128,0.2);border-radius:7px;"><div style="width:60%;height:14px;background:rgba(245,158,11,0.75);border-radius:7px;"></div></div>
<div style="font-size:0.9em;">Draft a record, update an internal ticket, stage a change in a sandbox</div>
</div>
<div style="padding:12px;border:1px solid rgba(128,128,128,0.35);border-radius:8px;">
<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;"><strong>Tier 3: Irreversible or external</strong><span>Gate: per-action human approval</span></div>
<div style="margin:8px 0;height:14px;background:rgba(128,128,128,0.2);border-radius:7px;"><div style="width:100%;height:14px;background:rgba(239,68,68,0.75);border-radius:7px;"></div></div>
<div style="font-size:0.9em;">Payments, client communications, publishing, deletions, production changes</div>
</div>
</div>
<figcaption style="font-size:0.85em;margin-top:8px;">Source: author's approval-gate model (Melson, 2026), aligned to OWASP Top 10 for LLM Applications (2025), LLM06 Excessive Agency. Bar widths are ordinal and illustrative, not measured data.</figcaption>
</figure>

The takeaway: oversight intensity should rise with blast radius, so the cheapest controls sit on the most frequent actions and the strictest controls sit on the rare ones that can hurt you.

### Who assigns the tier, and who can change it?

The risk owner assigns tiers, never the team that builds the agent. Builders are incentivized to lower tiers, because every gate adds friction to their product. Tier assignments should live in a register under change control, so moving an action from Tier 3 to Tier 2 leaves a record and needs the same sign-off as any other risk acceptance.

## Why must approval be per action and never carry forward?

Approval must be per action because an approval is a statement about one specific thing. Approving "send this email" says nothing about the next email. A standing approve-all turns the gate into a formality and removes the only control that matters when the agent is wrong or compromised.

In practice, an approval binds to a payload hash, is single use, and expires. If the agent changes one parameter after approval, the hash no longer matches and the action fails. Finance already knows this pattern: four-eyes release on payments exists because the person who prepares a payment should not be the only one who can release it.

### Separation of duties: the proposer is never the approver

The agent that proposes and the human who approves must be different principals, and the approver's identity must come from the authentication system, never from text the agent produces. If an agent can write "approved by the CFO" into a field and have it accepted, you have no control at all. The approver authenticates, reviews the actual payload, and signs.

## How does the approval gate stop prompt injection?

It does not prevent injection, but it contains it. Instructions come only from the accountable principal. Documents, emails, web pages and tool output are data, never commands. Even if hidden text hijacks the agent's reasoning, a Tier 3 action still cannot execute without a separate human approving that exact payload.

OWASP ranks [prompt injection as LLM01 in its 2025 Top 10 for LLM Applications](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) and lists segregating external content, privilege control and human approval for privileged operations among the mitigations, while noting that prevention remains difficult. Its entry on [excessive agency (LLM06)](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) names excessive functionality, permissions and autonomy as root causes and recommends human approval of high-impact actions. The gate is exactly that recommendation, made structural.

The mechanism is simple. The agent emits a proposal object. A human reviews it and signs an approval. The executor is a separate component that accepts only signed approvals for Tier 3 calls and enforces authorization in the downstream system rather than trusting the model to decide access. Credentials are scoped per tier, so the agent's own keys cannot perform irreversible actions. This is my design, not a standard, and it is containment, not a cure.

## What belongs in the audit trail, kill switch and rollback?

Keep an append-only record of each action: context hash, tool call, parameters, approver, outcome and timestamp. Put the kill switch at the credential or gateway layer so revoking access stops the agent regardless of what it believes. Write a rollback plan for every Tier 2 action, and drill it.

Immutability matters because the audit trail is your evidence to a supervisor. FINRA's 2026 oversight report flags [agents acting without human validation, exceeding their intended scope, and multi-step reasoning that complicates auditability](https://www.finra.org/rules-guidance/guidance/reports/2026-finra-annual-regulatory-oversight-report/gen-ai) as risks, and points to human-in-the-loop protocols and tracking of agent actions as considerations. A log you can reconstruct a decision from answers all three. For the telemetry side, see my note on [AI-driven network observability](/guide/operational-architecture/blog/network-observability-platforms).

## How do agents earn wider permissions?

Agents earn wider permissions through evaluation gates, not through time served. Before promoting an action from Tier 3 to Tier 2, require evidence: a low override and error rate on sampled actions, a passing prompt injection test suite, a tested rollback, and a named owner's sign-off. Promotions are time-boxed and reversible, with demotion triggers defined in advance.

The trade-offs are real. Approval adds latency, and reviewers who see hundreds of near-identical requests stop reading them. Risk-score the queue so unusual items surface first, and batch genuinely similar proposals for review, but never let batching become a blanket approval. Gartner predicts [over 40% of agentic AI projects will be canceled by end of 2027](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027) because of costs, unclear value or inadequate risk controls. Controls that reviewers can actually sustain are part of keeping a project alive.

## Which regulations already require this?

No regulation names these tiers, but several require the behaviors the tiers produce: human oversight, logging, incident handling, independent challenge and supervision. The model is a mapping onto existing obligations, not a legal opinion, and each framework has its own scope and status.

### Crosswalk: obligation to control

| Framework | What it asks for | Where the model answers it |
|---|---|---|
| [EU AI Act, Art. 14](https://artificialintelligenceact.eu/article/14/) | High-risk systems must allow effective human oversight: understand outputs, resist automation bias, override or reverse, and stop | Tier 3 approval, stop via kill switch, queue design against reviewer fatigue |
| [DORA, Reg. (EU) 2022/2554](https://www.jonesday.com/en/insights/2025/01/digital-operational-resilience-act-now-in-effect-for-financial-sector) | ICT risk management, incident handling, third-party risk (applies since 17 January 2025) | Audit trail, kill switch, model providers managed as ICT third parties (my inference) |
| [SR 26-2](https://www.federalreserve.gov/supervisionreg/srletters/SR2602.htm) | Materiality-proportional rigor and effective challenge for models | Tiering by exposure, separate approver as effective challenge |
| [NIST AI RMF 1.0](https://www.nist.gov/itl/ai-risk-management-framework) and [AI 600-1](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) | Govern, Map, Measure, Manage (voluntary) | Tier register, evaluation gates, sampling, demotion triggers |
| [ISO/IEC 42001:2023](https://www.iso.org/standard/81230.html) | Certifiable AI management system with risk treatment | Organization-level home for the tier register and reviews |
| [FINRA Notice 24-09](https://www.finra.org/rules-guidance/notices/24-09) | Existing supervision and recordkeeping rules apply to generative AI | Approval records double as supervisory evidence |

A few honest caveats. Article 14 applies to high-risk AI systems, not every agent, and under the Digital Omnibus as adopted in 2026 the Annex III high-risk obligations now apply from [2 December 2027](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/). A payments or email agent is not automatically high-risk. The Federal Reserve's SR 26-2 replaced the 2011 model risk guidance (SR 11-7) in April 2026 and explicitly puts generative and agentic AI outside its scope, so this model fills a gap rather than restating a rule. The guidance also does not set enforceable standards. For how this sits inside a wider shift, see my piece on the [agentic operating model](/guide/operational-architecture/blog/orchestrating-the-transition-generative-to-agentic-ai).

## Where do I start on Monday?

Start by inventorying what your AI agents can actually do, then gate every consequential action and widen permissions later, only on evidence. Five steps take a regulated financial firm from nothing to a defensible governance baseline without building a parallel bureaucracy.

1. **Inventory actions.** List every tool each agent can call and what it changes.
2. **Assign tiers.** Have the risk owner classify each action and record it in a register.
3. **Build the proposal and approval path.** Proposal object, authenticated approver, signed single-use approval, executor that rejects the rest.
4. **Turn on the audit trail and kill switch.** Append-only log, credential-level revocation, a rollback plan per Tier 2 action.
5. **Schedule promotion reviews.** Set evaluation criteria and a review cadence before anyone asks to loosen a gate.

This is the kind of cross-functional control design an [Operational Architect](/guide/operational-architecture/blog/operational-architect-definitive-guide) owns: the seam between technology, risk and operations where agent governance actually lives.

## Frequently Asked Questions

### How do you govern AI agents in financial services?

Tier every agent action by blast radius and attach a matching gate. Read-only actions run autonomously, reversible internal writes are logged and sampled, and irreversible or external actions such as payments and client communications need a named human's approval each time. Add an append-only audit trail, a kill switch and evaluation gates before any permission widens.

### What is an approval gate for an AI agent?

An approval gate is a control point between an agent's proposed action and its execution. The agent submits a proposal, an authenticated human reviews it, and the executor runs it only if it carries a valid approval bound to that exact payload. The approval is single use and expires.

### How does human-in-the-loop work with AI agents without slowing everything down?

Gate only the actions whose blast radius justifies it. Most agent activity is read-only or reversible and needs no sign-off. For the gated remainder, risk-score the queue and batch similar items for review, while still approving each action individually rather than granting a blanket approval.

### What regulatory frameworks apply to agentic AI in banking?

No single rule mandates agent controls by name. EU AI Act Article 14 (human oversight of high-risk systems), DORA (ICT risk, logging, third-party risk), US model risk guidance now in SR 26-2, NIST AI RMF, ISO/IEC 42001 and FINRA Regulatory Notice 24-09 all apply in part. The approval-gate model maps onto them, but it is not a legal opinion.

### Can an approval gate stop prompt injection?

It does not stop the injection itself, and OWASP notes prevention remains hard. It contains the damage: a hijacked agent can still propose a harmful action, but it cannot execute an irreversible one without a separate human approving that specific payload. Pair the gate with scoped credentials and untrusted-data tagging.

### When can an AI agent act autonomously?

When the action is read-only, or a reversible internal write with logging, sampling and a tested rollback. The agent should earn that status through evaluation gates such as low override rates on sampled actions and a passing prompt injection suite. Irreversible or external actions stay gated regardless of track record.

---

### Works Cited

- [1] Deloitte. "The State of AI in the Enterprise, 2026." Deloitte, 2026. [deloitte.com](https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html)
- [2] Gartner. "Gartner Says Applying Uniform Governance Across AI Agents Will Lead to Enterprise AI Agent Failure." Gartner, 2026. [gartner.com](https://www.gartner.com/en/newsroom/press-releases/2026-05-26-gartner-says-applying-uniform-governance-across-ai-agents-will-lead-to-enterprise-ai-agent-failure)
- [3] Gartner. "Gartner Predicts Over 40% of Agentic AI Projects Will Be Canceled by End of 2027." Gartner, 2025. [gartner.com](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027)
- [4] OWASP GenAI Security Project. "LLM01:2025 Prompt Injection." OWASP, 2025. [genai.owasp.org](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [5] OWASP GenAI Security Project. "LLM06:2025 Excessive Agency." OWASP, 2025. [genai.owasp.org](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)
- [6] FINRA. "2026 FINRA Annual Regulatory Oversight Report: GenAI." FINRA, 2025. [finra.org](https://www.finra.org/rules-guidance/guidance/reports/2026-finra-annual-regulatory-oversight-report/gen-ai)
- [7] FINRA. "Regulatory Notice 24-09: FINRA Reminds Members of Regulatory Obligations When Using Generative Artificial Intelligence and Large Language Models." FINRA, 2024. [finra.org](https://www.finra.org/rules-guidance/notices/24-09)
- [8] European Union. "Regulation (EU) 2024/1689, Article 14: Human Oversight." Artificial Intelligence Act, 2024. [artificialintelligenceact.eu](https://artificialintelligenceact.eu/article/14/)
- [9] Jones Day. "Digital Operational Resilience Act Now in Effect for Financial Sector." Jones Day, 2025. [jonesday.com](https://www.jonesday.com/en/insights/2025/01/digital-operational-resilience-act-now-in-effect-for-financial-sector)
- [10] Board of Governors of the Federal Reserve System. "SR 26-2: Revised Guidance on Model Risk Management." Federal Reserve, 2026. [federalreserve.gov](https://www.federalreserve.gov/supervisionreg/srletters/SR2602.htm)
- [11] NIST. "AI Risk Management Framework" and "AI RMF Generative AI Profile (NIST AI 600-1)." NIST, 2023 and 2024. [nist.gov](https://www.nist.gov/itl/ai-risk-management-framework)
- [12] ISO/IEC. "ISO/IEC 42001:2023 Information technology, Artificial intelligence, Management system." ISO, 2023. [iso.org](https://www.iso.org/standard/81230.html)
- [13] Gibson Dunn. "EU AI Act Omnibus Agreement: Postponed High-Risk Deadlines and Other Key Changes." Gibson Dunn, 2026. [gibsondunn.com](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/)
`
};
