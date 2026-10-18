-- ====================================================================
-- CLAT Compass: Realistic CLAT Seed Data
-- Contains authentic passage-based questions across all 5 CLAT sections
-- ====================================================================

-- 1. Insert Topics for each subject
do $$
declare
  sub_english uuid;
  sub_gk uuid;
  sub_legal uuid;
  sub_logical uuid;
  sub_quant uuid;

  topic_rc uuid;
  topic_const uuid;
  topic_tort uuid;
  topic_crit uuid;
  topic_di uuid;

  p_legal_1 uuid;
  p_english_1 uuid;
  p_logical_1 uuid;
  p_gk_1 uuid;
  p_quant_1 uuid;

  q_legal_1 uuid;
  q_legal_2 uuid;
  q_legal_3 uuid;
  q_legal_4 uuid;

  q_eng_1 uuid;
  q_eng_2 uuid;
  q_eng_3 uuid;
  q_eng_4 uuid;

  q_log_1 uuid;
  q_log_2 uuid;
  q_log_3 uuid;
  q_log_4 uuid;

  q_gk_1 uuid;
  q_gk_2 uuid;
  q_gk_3 uuid;
  q_gk_4 uuid;

  q_quant_1 uuid;
  q_quant_2 uuid;
  q_quant_3 uuid;
  q_quant_4 uuid;

  test_pyq_2024 uuid;
  test_full_mock_1 uuid;
  test_legal_sectional uuid;
begin
  -- Retrieve Subject IDs
  select id into sub_english from public.subjects where code = 'english';
  select id into sub_gk from public.subjects where code = 'gk';
  select id into sub_legal from public.subjects where code = 'legal';
  select id into sub_logical from public.subjects where code = 'logical';
  select id into sub_quant from public.subjects where code = 'quant';

  -- Insert Topics
  insert into public.topics (subject_id, name, slug)
  values
    (sub_english, 'Reading Comprehension', 'reading-comprehension'),
    (sub_legal, 'Constitutional Law & Rights', 'constitutional-law'),
    (sub_legal, 'Law of Torts & Crimes', 'torts-and-crimes'),
    (sub_logical, 'Critical Reasoning & Arguments', 'critical-reasoning'),
    (sub_quant, 'Data Interpretation Caselets', 'di-caselets')
  on conflict (subject_id, slug) do nothing;

  select id into topic_rc from public.topics where slug = 'reading-comprehension' limit 1;
  select id into topic_const from public.topics where slug = 'constitutional-law' limit 1;
  select id into topic_tort from public.topics where slug = 'torts-and-crimes' limit 1;
  select id into topic_crit from public.topics where slug = 'critical-reasoning' limit 1;
  select id into topic_di from public.topics where slug = 'di-caselets' limit 1;

  -- 2. PASSAGES & QUESTIONS

  -- Passage 1: Legal Reasoning (Doctrine of Necessity and Private Defence)
  insert into public.passages (title, content, subject_id, topic_id, source, word_count)
  values (
    'Doctrine of Private Defence and Proportionality',
    'The right of private defence is based on the cardinal principle that the state cannot protect every citizen at every moment and in all places. It is essentially a defensive right circumscribed by the governing principle that the force used must not be out of proportion to the apparent urgency of the situation. Nothing is an offence which is done in the exercise of the right of private defence. The right commences as soon as a reasonable apprehension of danger to the body arises from an attempt or threat to commit the offence, though the offence may not have been committed; and it continues as long as such apprehension of danger to the body continues.\n\nHowever, this right is subject to three crucial restrictions: First, the force inflicted must not be more than what is necessary to inflict for the purpose of defence. Second, there must not be sufficient time to have recourse to the protection of public authorities. Third, the right of private defence in no case extends to inflicting more harm than it is necessary to inflict for the purpose of defence, and the right to cause death is limited only to situations involving reasonable apprehension of death, grievous hurt, rape, or kidnapping. If the threat has ceased—such as when an assailant drops their weapon and flees—the right to use retaliatory force immediately extinguishes.',
    sub_legal,
    topic_tort,
    'Adapted from Indian Penal Code Jurisprudence & Supreme Court Rulings',
    215
  ) returning id into p_legal_1;

  -- Questions for Legal Passage
  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_legal_1,
      sub_legal,
      topic_tort,
      'A is walking in a lonely street at night when B rushes towards him shouting "I will break your skull!" holding an iron rod. A immediately draws an authorized licensed firearm and shoots B in the leg, causing injury. B drops the rod. Which of the following is correct?',
      '[
        {"id": "A", "text": "A is guilty of attempted murder because B had not yet hit him."},
        {"id": "B", "text": "A is protected by the right of private defence because reasonable apprehension of grievous hurt had arisen."},
        {"id": "C", "text": "A exceeded his right because he should have run to find a police officer first."},
        {"id": "D", "text": "A cannot claim private defence as firearms are disproportionate to iron rods in all cases."}
      ]'::jsonb,
      'B',
      'The right of private defence commences as soon as a reasonable apprehension of danger to the body arises from an attempt or threat. A rushed assault with an iron rod creates a reasonable apprehension of death or grievous hurt. Since A was in a lonely street, there was no time to seek police help, and shooting at the leg was proportionate to neutralize the threat.',
      1.0, 0.25, 'medium', true, 2024, ARRAY['Legal Reasoning', 'Private Defence', 'PYQ 2024']
    ) returning id into q_legal_1;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_legal_1,
      sub_legal,
      topic_tort,
      'Suppose in the above scenario, after B dropped the iron rod and turned around running away, A fired a second bullet into B’s back, killing him. Is A protected by the right of private defence?',
      '[
        {"id": "A", "text": "Yes, because B was the initial aggressor and started the altercation."},
        {"id": "B", "text": "Yes, because A could reasonably suspect B might return with reinforcements."},
        {"id": "C", "text": "No, because the apprehension of danger extinguished once B dropped his weapon and fled; retaliatory vengeance is not private defence."},
        {"id": "D", "text": "Yes, because the law allows taking an assailant’s life whenever an assault is attempted."}
      ]'::jsonb,
      'C',
      'The passage explicitly notes that the right continues only as long as the apprehension of danger continues. Once an assailant drops their weapon and flees, the threat ceases and any subsequent violence is retaliatory punitive force, not lawful defence.',
      1.0, 0.25, 'medium', true, 2024, ARRAY['Legal Reasoning', 'Private Defence']
    ) returning id into q_legal_2;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_legal_1,
      sub_legal,
      topic_tort,
      'X discovers that Y has stolen mangoes from his orchard at 2:00 PM and is walking away. X pulls out a hunting rifle and shoots Y dead. X claims private defence of property. Will X succeed?',
      '[
        {"id": "A", "text": "Yes, because theft of property permits using lethal force."},
        {"id": "B", "text": "No, because lethal force is disproportionate for theft of mangoes and causes more harm than necessary."},
        {"id": "C", "text": "Yes, provided the orchard was private gated property."},
        {"id": "D", "text": "No, unless X can prove the mangoes were of exceptionally high market value."}
      ]'::jsonb,
      'B',
      'The right of private defence in no case extends to inflicting more harm than is necessary. Taking a life for petty theft of fruits violates the fundamental requirement of proportionality.',
      1.0, 0.25, 'easy', false, null, ARRAY['Legal Reasoning', 'Proportionality']
    ) returning id into q_legal_3;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_legal_1,
      sub_legal,
      topic_tort,
      'Which core principle underlies the limitation that private defence cannot be exercised when there is time to contact public authorities?',
      '[
        {"id": "A", "text": "The citizen is subordinate to the police in physical capability."},
        {"id": "B", "text": "Self-help is a measure of absolute last resort, subordinate to the state’s monopoly on legitimate violence."},
        {"id": "C", "text": "Police forces are legally liable for damages if private citizens defend themselves."},
        {"id": "D", "text": "Private citizens must always obtain prior magistrate sanction before defending themselves."}
      ]'::jsonb,
      'B',
      'The primary rationale of private defence is that the state cannot be omnipresent; where state protection is available, private violence is unnecessary and unlawful.',
      1.0, 0.25, 'hard', false, null, ARRAY['Legal Reasoning', 'Jurisprudence']
    ) returning id into q_legal_4;


  -- Passage 2: English Language (Literature / Cognitive Psychology on Deep Reading)
  insert into public.passages (title, content, subject_id, topic_id, source, word_count)
  values (
    'The Loss of Deep Reading in the Algorithmic Age',
    'The architecture of digital reading does not merely alter the medium; it fundamentally rewires the neural circuitry of comprehension. Deep reading—the contemplative, immersive cognitive process whereby a reader moves beyond literal decoding to inferential analysis, empathy, and critical evaluation—requires sustained quietude. The online environment, conversely, is an intentional attentional casino designed to fragment focus. Hyperlinks, pop-ups, endless feeds, and notification pings train the ocular apparatus to skim, dart, and scavenge rather than linger and synthesize.\n\nCognitive neuroscientists demonstrate that when readers transition from print to illuminated screens, the cognitive load shifts from semantic processing to sensory triage. We read in an F-shaped pattern: glancing across the top lines, skimming downwards along the left margin, and discarding subordinate clauses that carry the delicate nuance of moral deliberation. If our jurisprudence and democratic deliberation depend on the citizenry’s ability to parse complex legislative texts and appreciate contradictory viewpoints, the cognitive drift towards superficial information grazing poses an existential hazard to civil society.',
    sub_english,
    topic_rc,
    'Adapted from Contemporary Cognitive Science & Literary Essays',
    188
  ) returning id into p_english_1;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_english_1,
      sub_english,
      topic_rc,
      'What is the central thesis advanced by the author in the passage?',
      '[
        {"id": "A", "text": "Printed books will become completely obsolete within the next decade due to digital dominance."},
        {"id": "B", "text": "Screen-based reading conditions cognitive skimming, which threatens the deep analytical capacities vital for democratic society."},
        {"id": "C", "text": "Cognitive neuroscientists believe digital screens cause permanent visual ocular degradation."},
        {"id": "D", "text": "Legislative drafting should be simplified to conform to modern F-shaped skimming habits."}
      ]'::jsonb,
      'B',
      'The author argues that digital media fragments attention into skimming and warns that the erosion of deep reading threatens the ability to engage in complex democratic deliberation.',
      1.0, 0.25, 'medium', true, 2024, ARRAY['English', 'Central Theme', 'PYQ 2024']
    ) returning id into q_eng_1;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_english_1,
      sub_english,
      topic_rc,
      'In the phrase "the cognitive load shifts from semantic processing to sensory triage", what does "sensory triage" most nearly mean?',
      '[
        {"id": "A", "text": "Translating foreign vocabulary into native dialect."},
        {"id": "B", "text": "Prioritizing and filtering distracting visual stimuli instead of grasping deep meaning."},
        {"id": "C", "text": "Medical emergency response to cognitive exhaustion."},
        {"id": "D", "text": "Deliberate memorization of factual dates and chronological figures."}
      ]'::jsonb,
      'B',
      'Triage refers to sorting according to urgency; "sensory triage" here means the brain is forced to rapidly sort out hyperlinks, pop-ups, and notifications rather than focusing on textual meaning (semantics).',
      1.0, 0.25, 'hard', false, null, ARRAY['English', 'Vocabulary in Context']
    ) returning id into q_eng_2;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_english_1,
      sub_english,
      topic_rc,
      'Why does the author characterize the online environment as an "attentional casino"?',
      '[
        {"id": "A", "text": "Because online gambling websites are the primary sources of digital text."},
        {"id": "B", "text": "Because digital platforms deliberately engineer unpredictable rewards and distractions to capture human focus."},
        {"id": "C", "text": "Because users waste monetary wealth when subscribing to digital news outlets."},
        {"id": "D", "text": "Because digital reading outcomes are completely randomized without predictable learning."}
      ]'::jsonb,
      'B',
      'The metaphor of a casino evokes deliberate architectural manipulation designed to keep people hooked through constant intermittent stimuli (notifications, pings, feeds).',
      1.0, 0.25, 'medium', false, null, ARRAY['English', 'Metaphor Analysis']
    ) returning id into q_eng_3;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_english_1,
      sub_english,
      topic_rc,
      'Based on the passage, which of the following practices would the author MOST likely advocate to preserve deep reading?',
      '[
        {"id": "A", "text": "Reading multiple digital tabs concurrently to increase cognitive processing rate."},
        {"id": "B", "text": "Adopting AI text summarizers for all lengthy legal cases."},
        {"id": "C", "text": "Carving out uninterrupted periods for reading physically printed long-form literature without digital interference."},
        {"id": "D", "text": "Replacing all text-based legislation with audio-visual explanatory animations."}
      ]'::jsonb,
      'C',
      'The author explicitly highlights sustained quietude and print as necessary conditions for deep contemplation, empathy, and synthesis.',
      1.0, 0.25, 'easy', false, null, ARRAY['English', 'Author Stance']
    ) returning id into q_eng_4;


  -- Passage 3: Logical Reasoning (Critical Reasoning - Urban Policy & Congestion)
  insert into public.passages (title, content, subject_id, topic_id, source, word_count)
  values (
    'The Paradox of Induced Travel Demand',
    'Municipal authorities facing worsening traffic congestion almost reflexively expand vehicular roadway capacity: widening multi-lane ring roads, constructing grade-separated flyovers, and building arterial bypasses. Yet transportation economists consistently observe what is known as "induced demand." Increasing highway supply lowers travel time initially, which lowers the perceived cost of driving. Consequently, commuters who previously took suburban railways switch to private cars; motorists shift departure times to peak rush hour; and real estate developers build exurban bedroom communities farther from metropolitan cores.\n\nWithin five to seven years of highway widening, traffic density invariably rebounds to or exceeds pre-expansion saturation levels. The billions poured into asphalt could have permanently reduced gridlock had they been dedicated to segregated mass bus transit and dedicated bicycle corridors. Therefore, any metropolitan transportation policy predicated solely on road expansion is structurally doomed to failure.',
    sub_logical,
    topic_crit,
    'Urban Economics and Infrastructure Planning Journal',
    155
  ) returning id into p_logical_1;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_logical_1,
      sub_logical,
      topic_crit,
      'Which of the following is an unstated assumption required for the author’s conclusion that road expansion alone is doomed to failure?',
      '[
        {"id": "A", "text": "Vehicular emissions are the sole contributor to global urban air pollution."},
        {"id": "B", "text": "Commuters will continuously utilize newly created roadway capacity if private vehicle transit remains unconstrained."},
        {"id": "C", "text": "Suburban trains are completely free of operational delays."},
        {"id": "D", "text": "Bicycle lanes generate substantial municipal tax revenue."}
      ]'::jsonb,
      'B',
      'The argument that expanding roads will always lead back to saturation relies on the premise that latent commuter demand exists and will absorb extra capacity as long as private vehicle transit remains unchecked.',
      1.0, 0.25, 'hard', true, 2024, ARRAY['Logical Reasoning', 'Assumption', 'PYQ 2024']
    ) returning id into q_log_1;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_logical_1,
      sub_logical,
      topic_crit,
      'Which of the following, if true, would MOST WEAKEN the author’s argument?',
      '[
        {"id": "A", "text": "A neighboring city widened its arterial ring road while concurrently enacting strict dynamic peak-hour congestion pricing, resulting in a sustained 40% reduction in travel time over a decade."},
        {"id": "B", "text": "Bicycle manufacturing companies sponsored several urban transport research papers."},
        {"id": "C", "text": "Commuters prefer air-conditioned private cars over crowded suburban railways during hot summer months."},
        {"id": "D", "text": "Flyovers require periodic structural maintenance every three years."}
      ]'::jsonb,
      'A',
      'Option A shows that road capacity combined with demand management can successfully alleviate congestion long-term, directly challenging the claim that road expansion is structurally doomed to fail.',
      1.0, 0.25, 'medium', false, null, ARRAY['Logical Reasoning', 'Weaken']
    ) returning id into q_log_2;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_logical_1,
      sub_logical,
      topic_crit,
      'Which of the following best mirrors the logical fallacy or phenomenon of "induced demand" in a different domain?',
      '[
        {"id": "A", "text": "A restaurant opens a second dining hall, but customers stop coming because the food quality deteriorates."},
        {"id": "B", "text": "A hospital builds 100 extra ICU beds to reduce patient waitlists, but surrounding clinics immediately refer all marginal patients there, causing the waitlist to grow back to its original length."},
        {"id": "C", "text": "A smartphone manufacturer cuts prices, leading to immediate bankruptcy due to supply shortage."},
        {"id": "D", "text": "A university raises tuition fees to build a sports stadium, causing student protests."}
      ]'::jsonb,
      'B',
      'Option B is an exact parallel: expanding capacity lowers the barrier to entry, which attracts latent demand that quickly consumes all newly added capacity.',
      1.0, 0.25, 'hard', false, null, ARRAY['Logical Reasoning', 'Parallel Reasoning']
    ) returning id into q_log_3;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_logical_1,
      sub_logical,
      topic_crit,
      'Based on the passage, the author views the diversion of municipal funds into road expansion as:',
      '[
        {"id": "A", "text": "Prudent and visionary for long-term economic development."},
        {"id": "B", "text": "Misallocated expenditure that sacrifices truly sustainable public transit alternatives."},
        {"id": "C", "text": "Harmful solely because of the cost of raw asphalt."},
        {"id": "D", "text": "Beneficial only for heavy freight and logistics transport."}
      ]'::jsonb,
      'B',
      'The author explicitly states: "The billions poured into asphalt could have permanently reduced gridlock had they been dedicated to segregated mass bus transit and dedicated bicycle corridors."',
      1.0, 0.25, 'easy', false, null, ARRAY['Logical Reasoning', 'Inference']
    ) returning id into q_log_4;


  -- Passage 4: Current Affairs & GK (Digital Personal Data Protection Act)
  insert into public.passages (title, content, subject_id, topic_id, source, word_count)
  values (
    'Digital Personal Data Protection Act, 2023: Architecture & Rights',
    'The enactment of the Digital Personal Data Protection Act (DPDPA), 2023 represents India’s statutory framework operationalizing the fundamental right to privacy affirmed in Justice K.S. Puttaswamy (Retd.) v. Union of India (2017). The Act regulates the processing of digital personal data by entities designated as "Data Fiduciaries", who determine the purpose and means of data processing, on behalf of individuals termed "Data Principals".\n\nCentral to the statutory architecture is the requirement of free, specific, informed, unconditional, and unambiguous consent accompanied by a notice in clear plain language. The Act establishes the Data Protection Board of India (DPBI) as an adjudicatory body empowered to impose financial penalties of up to Rs 250 crore for significant breaches. However, critics point to wide exemptions granted to state instrumentalities under Section 17 on grounds of sovereignty, security of the state, and maintenance of public order.',
    sub_gk,
    topic_const,
    'Ministry of Law and Justice & Supreme Court Case Digest',
    160
  ) returning id into p_gk_1;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_gk_1,
      sub_gk,
      topic_const,
      'In which landmark Supreme Court of India judgement was the Right to Privacy unanimously held to be a fundamental right under Article 21 of the Constitution?',
      '[
        {"id": "A", "text": "Navtej Singh Johar v. Union of India"},
        {"id": "B", "text": "Justice K.S. Puttaswamy (Retd.) v. Union of India"},
        {"id": "C", "text": "Shreya Singhal v. Union of India"},
        {"id": "D", "text": "Joseph Shine v. Union of India"}
      ]'::jsonb,
      'B',
      'The 9-judge Constitution Bench in Justice K.S. Puttaswamy (2017) unanimously held that privacy is a fundamental right protected under Article 21 and Part III of the Constitution.',
      1.0, 0.25, 'easy', true, 2024, ARRAY['GK', 'Constitutional Law', 'PYQ 2024']
    ) returning id into q_gk_1;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_gk_1,
      sub_gk,
      topic_const,
      'Under the DPDPA 2023, what is the maximum financial penalty that can be imposed by the Data Protection Board for a significant failure to prevent personal data breach?',
      '[
        {"id": "A", "text": "Rs 50 crore"},
        {"id": "B", "text": "Rs 100 crore"},
        {"id": "C", "text": "Rs 250 crore"},
        {"id": "D", "text": "Rs 500 crore"}
      ]'::jsonb,
      'C',
      'Under Schedule of Penalties in DPDPA 2023, failure to take reasonable security safeguards to prevent personal data breach can attract penalties up to Rs 250 crore.',
      1.0, 0.25, 'medium', false, null, ARRAY['GK', 'DPDPA']
    ) returning id into q_gk_2;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_gk_1,
      sub_gk,
      topic_const,
      'According to the terminology of the DPDPA 2023, who is a "Data Principal"?',
      '[
        {"id": "A", "text": "The company that stores data on cloud servers."},
        {"id": "B", "text": "The individual to whom the personal data relates."},
        {"id": "C", "text": "The chairperson of the Data Protection Board of India."},
        {"id": "D", "text": "The government ministry in charge of telecommunications."}
      ]'::jsonb,
      'B',
      'Under Section 2(j) of the DPDPA, Data Principal means the individual to whom the personal data relates and where such individual is a child or person with disability, includes their parent or lawful guardian.',
      1.0, 0.25, 'easy', false, null, ARRAY['GK', 'Definitions']
    ) returning id into q_gk_3;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_gk_1,
      sub_gk,
      topic_const,
      'Which international data protection regulation served as the global pioneer and benchmark for omnibus privacy laws such as India’s DPDPA?',
      '[
        {"id": "A", "text": "Health Insurance Portability and Accountability Act (HIPAA)"},
        {"id": "B", "text": "General Data Protection Regulation (GDPR) of the European Union"},
        {"id": "C", "text": "Digital Millennium Copyright Act (DMCA)"},
        {"id": "D", "text": "Basel III Accords"}
      ]'::jsonb,
      'B',
      'The European Union’s General Data Protection Regulation (GDPR), which took effect in 2018, established modern global benchmarks for data protection principles, fiduciary obligations, and principal rights.',
      1.0, 0.25, 'medium', false, null, ARRAY['GK', 'International Law']
    ) returning id into q_gk_4;


  -- Passage 5: Quantitative Techniques (DI Caselet: Law School Cohort Statistics)
  insert into public.passages (title, content, subject_id, topic_id, source, word_count)
  values (
    'NLU Batch Placement and Career Distribution Caselet',
    'A premier National Law University (NLU) admitted a total batch of 160 students in the year 2019. Upon graduation in 2024, the graduating cohort was surveyed regarding their immediate career trajectories:\n\n• 40% of the total graduating students secured jobs in Tier-1 and Tier-2 Corporate Law Firms.\n• 25% of the total students opted for Judicial Clerkships or Litigation under Senior Advocates.\n• 15% of the total students opted for Higher Studies (LL.M. abroad or in India).\n• 10% of the total students opted for Public Policy, In-House Counsel, or Think Tanks.\n• The remaining students decided to prepare full-time for the Judicial Services Examination or Civil Services.\n• Among the students joining Corporate Law Firms, the ratio of female students to male students was 5:3.',
    sub_quant,
    topic_di,
    'Bar & Bench Annual Law Graduate Employment Survey',
    142
  ) returning id into p_quant_1;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_quant_1,
      sub_quant,
      topic_di,
      'What is the total number of students who joined Corporate Law Firms?',
      '[
        {"id": "A", "text": "48"},
        {"id": "B", "text": "56"},
        {"id": "C", "text": "64"},
        {"id": "D", "text": "72"}
      ]'::jsonb,
      'C',
      'Total batch = 160 students. 40% of 160 = (40 / 100) * 160 = 64 students.',
      1.0, 0.25, 'easy', true, 2024, ARRAY['Quantitative Techniques', 'Percentage', 'PYQ 2024']
    ) returning id into q_quant_1;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_quant_1,
      sub_quant,
      topic_di,
      'Among the students who joined Corporate Law Firms, how many are female students?',
      '[
        {"id": "A", "text": "35"},
        {"id": "B", "text": "40"},
        {"id": "C", "text": "45"},
        {"id": "D", "text": "50"}
      ]'::jsonb,
      'B',
      'Corporate law firm hires = 64. Ratio of female to male = 5:3. Total parts = 5 + 3 = 8. Female students = (5/8) * 64 = 5 * 8 = 40 female students.',
      1.0, 0.25, 'medium', true, 2024, ARRAY['Quantitative Techniques', 'Ratios', 'PYQ 2024']
    ) returning id into q_quant_2;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_quant_1,
      sub_quant,
      topic_di,
      'How many students opted to prepare full-time for Judicial Services or Civil Services?',
      '[
        {"id": "A", "text": "12"},
        {"id": "B", "text": "16"},
        {"id": "C", "text": "20"},
        {"id": "D", "text": "24"}
      ]'::jsonb,
      'B',
      'Total percentages accounted for: 40% (Corporate) + 25% (Litigation) + 15% (Higher Studies) + 10% (Policy) = 90%. Remaining percentage = 100% - 90% = 10%. 10% of 160 = 16 students.',
      1.0, 0.25, 'easy', false, null, ARRAY['Quantitative Techniques', 'Percentage']
    ) returning id into q_quant_3;

  insert into public.questions (passage_id, subject_id, topic_id, question_text, options, correct_option, explanation, marks_positive, marks_negative, difficulty, is_pyq, pyq_year, tags)
  values
    (
      p_quant_1,
      sub_quant,
      topic_di,
      'What is the ratio of students opting for Higher Studies to students opting for Judicial Clerkships or Litigation?',
      '[
        {"id": "A", "text": "3:5"},
        {"id": "B", "text": "2:3"},
        {"id": "C", "text": "4:7"},
        {"id": "D", "text": "5:8"}
      ]'::jsonb,
      'A',
      'Students in Higher Studies = 15% of 160 = 24 students. Students in Litigation/Clerkships = 25% of 160 = 40 students. Ratio = 24 : 40 = 3 : 5 (or 15% : 25% = 3 : 5).',
      1.0, 0.25, 'medium', false, null, ARRAY['Quantitative Techniques', 'Ratio & Proportion']
    ) returning id into q_quant_4;


  -- 3. CREATE TESTS & ASSIGN QUESTIONS

  -- Test 1: CLAT 2024 Actual Paper Sample (PYQ)
  insert into public.tests (title, slug, description, type, duration_minutes, total_marks, positive_mark, negative_mark, is_published, pyq_year)
  values (
    'CLAT 2024 Official Paper Sample (Passage-Based)',
    'clat-2024-official-paper-sample',
    'Official CLAT 2024 sample examination featuring passage-based questions across Legal Reasoning, English, Logical Reasoning, Current Affairs, and Quant.',
    'pyq',
    120,
    20.0,
    1.0,
    0.25,
    true,
    2024
  ) returning id into test_pyq_2024;

  -- Test 2: CLAT All India Open Mock 1 (Full Mock)
  insert into public.tests (title, slug, description, type, duration_minutes, total_marks, positive_mark, negative_mark, is_published)
  values (
    'CLAT All India Open Mock 1',
    'clat-all-india-open-mock-1',
    'Comprehensive full-length mock simulation mirroring the exact CLAT Consortium examination pattern, negative marking, and split-screen CBT interface.',
    'full_mock',
    120,
    20.0,
    1.0,
    0.25,
    true
  ) returning id into test_full_mock_1;

  -- Test 3: Sectional Test - Legal Reasoning Marathon
  insert into public.tests (title, slug, description, type, duration_minutes, total_marks, positive_mark, negative_mark, is_published, subject_id)
  values (
    'Legal Reasoning Sectional Master Test',
    'legal-reasoning-sectional-master',
    'Intensive sectional mock focused exclusively on constitutional doctrines, criminal law, and torts with detailed analytical explanations.',
    'sectional',
    35,
    4.0,
    1.0,
    0.25,
    true,
    sub_legal
  ) returning id into test_legal_sectional;

  -- Link Questions to Test 1 (PYQ 2024)
  insert into public.test_questions (test_id, question_id, order_seq, section_name)
  values
    (test_pyq_2024, q_legal_1, 1, 'Legal Reasoning'),
    (test_pyq_2024, q_legal_2, 2, 'Legal Reasoning'),
    (test_pyq_2024, q_legal_3, 3, 'Legal Reasoning'),
    (test_pyq_2024, q_legal_4, 4, 'Legal Reasoning'),
    (test_pyq_2024, q_eng_1, 5, 'English Language'),
    (test_pyq_2024, q_eng_2, 6, 'English Language'),
    (test_pyq_2024, q_eng_3, 7, 'English Language'),
    (test_pyq_2024, q_eng_4, 8, 'English Language'),
    (test_pyq_2024, q_log_1, 9, 'Logical Reasoning'),
    (test_pyq_2024, q_log_2, 10, 'Logical Reasoning'),
    (test_pyq_2024, q_log_3, 11, 'Logical Reasoning'),
    (test_pyq_2024, q_log_4, 12, 'Logical Reasoning'),
    (test_pyq_2024, q_gk_1, 13, 'Current Affairs & GK'),
    (test_pyq_2024, q_gk_2, 14, 'Current Affairs & GK'),
    (test_pyq_2024, q_gk_3, 15, 'Current Affairs & GK'),
    (test_pyq_2024, q_gk_4, 16, 'Current Affairs & GK'),
    (test_pyq_2024, q_quant_1, 17, 'Quantitative Techniques'),
    (test_pyq_2024, q_quant_2, 18, 'Quantitative Techniques'),
    (test_pyq_2024, q_quant_3, 19, 'Quantitative Techniques'),
    (test_pyq_2024, q_quant_4, 20, 'Quantitative Techniques')
  on conflict do nothing;

  -- Link Questions to Test 2 (Full Mock 1)
  insert into public.test_questions (test_id, question_id, order_seq, section_name)
  values
    (test_full_mock_1, q_legal_1, 1, 'Legal Reasoning'),
    (test_full_mock_1, q_legal_2, 2, 'Legal Reasoning'),
    (test_full_mock_1, q_legal_3, 3, 'Legal Reasoning'),
    (test_full_mock_1, q_legal_4, 4, 'Legal Reasoning'),
    (test_full_mock_1, q_eng_1, 5, 'English Language'),
    (test_full_mock_1, q_eng_2, 6, 'English Language'),
    (test_full_mock_1, q_eng_3, 7, 'English Language'),
    (test_full_mock_1, q_eng_4, 8, 'English Language'),
    (test_full_mock_1, q_log_1, 9, 'Logical Reasoning'),
    (test_full_mock_1, q_log_2, 10, 'Logical Reasoning'),
    (test_full_mock_1, q_log_3, 11, 'Logical Reasoning'),
    (test_full_mock_1, q_log_4, 12, 'Logical Reasoning'),
    (test_full_mock_1, q_gk_1, 13, 'Current Affairs & GK'),
    (test_full_mock_1, q_gk_2, 14, 'Current Affairs & GK'),
    (test_full_mock_1, q_gk_3, 15, 'Current Affairs & GK'),
    (test_full_mock_1, q_gk_4, 16, 'Current Affairs & GK'),
    (test_full_mock_1, q_quant_1, 17, 'Quantitative Techniques'),
    (test_full_mock_1, q_quant_2, 18, 'Quantitative Techniques'),
    (test_full_mock_1, q_quant_3, 19, 'Quantitative Techniques'),
    (test_full_mock_1, q_quant_4, 20, 'Quantitative Techniques')
  on conflict do nothing;

  -- Link Questions to Test 3 (Legal Sectional)
  insert into public.test_questions (test_id, question_id, order_seq, section_name)
  values
    (test_legal_sectional, q_legal_1, 1, 'Legal Reasoning'),
    (test_legal_sectional, q_legal_2, 2, 'Legal Reasoning'),
    (test_legal_sectional, q_legal_3, 3, 'Legal Reasoning'),
    (test_legal_sectional, q_legal_4, 4, 'Legal Reasoning')
  on conflict do nothing;

end $$;
