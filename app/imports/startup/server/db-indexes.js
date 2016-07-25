import { Departments } from '/imports/api/departments/departments.js';
import { ImprovementPlans } from '/imports/api/improvement-plans/improvement-plans.js';
import { LessonsLearned } from '/imports/api/lessons/lessons.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { Standards } from '/imports/api/standards/standards.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Occurrences } from '/imports/api/occurrences/occurrences.js';


// indexes for Departments
Departments._ensureIndex({
  organizationId: 1
});


// indexes for ImprovementPlans
ImprovementPlans._ensureIndex({
  standardId: 1
});


// indexes for LessonsLearned
LessonsLearned._ensureIndex({
  organizationId: 1
});


// indexes for Organizations
Organizations._ensureIndex({
  serialNumber: 1
});

Organizations._ensureIndex({
  name: 1
});

Organizations._ensureIndex({
  'users.userId': 1
});

Organizations._ensureIndex({
  'users.role': 1
});

Organizations._ensureIndex({
  'users.isRemoved': 1
});


// indexes for StandardsBookSections
StandardsBookSections._ensureIndex({
  organizationId: 1
});


// indexes for StandardTypes
StandardTypes._ensureIndex({
  organizationId: 1
});


// indexes for Standards
Standards._ensureIndex({
  organizationId: 1
});

Standards._ensureIndex({
  isDeleted: 1
});

Standards._ensureIndex({
  viewedBy: 1
});

// indexes for NonConformities
NonConformities._ensureIndex({
  organizationId: 1
});

NonConformities._ensureIndex({
  isDeleted: 1
});

NonConformities._ensureIndex({
  viewedBy: 1
});

NonConformities._ensureIndex({
  title: 1
});

NonConformities._ensureIndex({
  sequentialId: 1
});

NonConformities._ensureIndex({
  departmentsIds: 1
});

NonConformities._ensureIndex({
  standardsIds: 1
});

NonConformities._ensureIndex({
  status: 1
});

NonConformities._ensureIndex({
  magnitude: 1
});

NonConformities._ensureIndex({
  sequentialId: 1,
  title: 1
});


// indexes for Occurrences
Occurrences._ensureIndex({
  nonConformityId: 1
});

// indexes for Risks
Risks._ensureIndex({
  organizationId: 1
});

Risks._ensureIndex({
  isDeleted: 1
});

Risks._ensureIndex({
  viewedBy: 1
});

Risks._ensureIndex({
  title: 1
});

Risks._ensureIndex({
  sequentialId: 1
});

Risks._ensureIndex({
  scores: 1
});

Risks._ensureIndex({
  departmentsIds: 1
});

Risks._ensureIndex({
  standardsIds: 1
});

Risks._ensureIndex({
  status: 1
});

Risks._ensureIndex({
  magnitude: 1
});

Risks._ensureIndex({
  sequentialId: 1,
  title: 1
});
