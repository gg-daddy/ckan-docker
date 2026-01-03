import { useState } from 'react';
import { TagWithCount, OrganizationWithCount, FormatWithCount, formatResourceFormat } from '@/lib/ckan';

interface FacetSectionProps {
  title: string;
  items: { name: string; display_name?: string; count: number }[];
  selectedItems: string[];
  onToggle: (name: string) => void;
  formatLabel?: (name: string) => string;
  defaultExpanded?: boolean;
}

function FacetSection({
  title,
  items,
  selectedItems,
  onToggle,
  formatLabel,
  defaultExpanded = true,
}: FacetSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);

  const displayItems = showAll ? items : items.slice(0, 5);
  const hasMore = items.length > 5;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="facet-section">
      <button
        className="facet-header w-full"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="facet-title">{title}</span>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="facet-list animate-fade-in">
          {displayItems.map((item) => {
            const isSelected = selectedItems.includes(item.name);
            const label = formatLabel ? formatLabel(item.name) : (item.display_name || item.name);

            return (
              <label key={item.name} className="facet-item">
                <input
                  type="checkbox"
                  className="facet-checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(item.name)}
                />
                <span className="facet-label truncate" title={label}>
                  {label}
                </span>
                <span className="facet-count">{item.count}</span>
              </label>
            );
          })}

          {hasMore && (
            <button
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-2 pl-2"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show less' : `Show ${items.length - 5} more`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface FacetSidebarProps {
  tags: TagWithCount[];
  organizations: OrganizationWithCount[];
  formats: FormatWithCount[];
  selectedTags: string[];
  selectedOrganizations: string[];
  selectedFormats: string[];
  onTagToggle: (tag: string) => void;
  onOrganizationToggle: (org: string) => void;
  onFormatToggle: (format: string) => void;
  onClearAll: () => void;
}

export default function FacetSidebar({
  tags,
  organizations,
  formats,
  selectedTags,
  selectedOrganizations,
  selectedFormats,
  onTagToggle,
  onOrganizationToggle,
  onFormatToggle,
  onClearAll,
}: FacetSidebarProps) {
  const hasActiveFilters = selectedTags.length > 0 || selectedOrganizations.length > 0 || selectedFormats.length > 0;

  // Convert organizations to the expected format
  const orgItems = organizations.map(org => ({
    name: org.name,
    display_name: org.title,
    count: org.package_count || 0,
  })).filter(org => org.count > 0);

  // Convert formats
  const formatItems = formats.map(fmt => ({
    name: fmt.name,
    display_name: formatResourceFormat(fmt.name),
    count: fmt.count,
  })).filter(fmt => fmt.count > 0);

  // Convert tags
  const tagItems = tags.map(tag => ({
    name: tag.name,
    display_name: tag.display_name,
    count: tag.count,
  })).filter(tag => tag.count > 0);

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="card p-4">
          <FacetSection
            title="Topics"
            items={tagItems}
            selectedItems={selectedTags}
            onToggle={onTagToggle}
          />

          <FacetSection
            title="Agencies"
            items={orgItems}
            selectedItems={selectedOrganizations}
            onToggle={onOrganizationToggle}
          />

          <FacetSection
            title="Formats"
            items={formatItems}
            selectedItems={selectedFormats}
            onToggle={onFormatToggle}
            formatLabel={formatResourceFormat}
          />
        </div>
      </div>
    </aside>
  );
}

// Mobile filter drawer component
interface MobileFilterDrawerProps extends FacetSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  tags,
  organizations,
  formats,
  selectedTags,
  selectedOrganizations,
  selectedFormats,
  onTagToggle,
  onOrganizationToggle,
  onFormatToggle,
  onClearAll,
}: MobileFilterDrawerProps) {
  const hasActiveFilters = selectedTags.length > 0 || selectedOrganizations.length > 0 || selectedFormats.length > 0;
  const activeFilterCount = selectedTags.length + selectedOrganizations.length + selectedFormats.length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="filter-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="filter-drawer">
        <div className="filter-drawer-handle" />

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close filters"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <FacetSidebar
            tags={tags}
            organizations={organizations}
            formats={formats}
            selectedTags={selectedTags}
            selectedOrganizations={selectedOrganizations}
            selectedFormats={selectedFormats}
            onTagToggle={onTagToggle}
            onOrganizationToggle={onOrganizationToggle}
            onFormatToggle={onFormatToggle}
            onClearAll={onClearAll}
          />

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            {hasActiveFilters && (
              <button
                onClick={onClearAll}
                className="btn-secondary flex-1"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="btn-primary flex-1"
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
