import { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import cn from 'classnames';
import SexFilter from '../types/SexFilter';
import { Link, useParams } from 'react-router-dom';
import { PersonLink } from './PersonLink';

type FilterTypesPeople = 'name' | 'sex' | 'born' | 'died';
type SortOrder = 'none' | 'asc' | 'desc';

type PeopleTableProps = {
  persons: Person[];
  sexFilter: SexFilter;
  inputFilterText: string;
  centuriesFilter: string[];
};

export const PeopleTable = ({
  persons,
  sexFilter,
  inputFilterText,
  centuriesFilter,
}: PeopleTableProps) => {
  const [sortBy, setSortBy] = useState<FilterTypesPeople | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const { slug } = useParams<{ slug?: string }>();

  const byName = useMemo(
    () => new Map(persons.map(p => [p.name, p] as const)),
    [persons],
  );

  const nameSet = useMemo(() => {
    const s = new Set<string>();

    for (const p of persons) {
      if (p.name) {
        s.add(p.name);
      }
    }

    return s;
  }, [persons]);

  const highlightName = useCallback(
    (name: string | null) => !!name && nameSet.has(name),
    [nameSet],
  );

  const handleSort = useCallback(
    (filterType: FilterTypesPeople) => {
      if (sortBy !== filterType) {
        setSortBy(filterType);
        setSortOrder('asc');

        return;
      }

      setSortOrder(prevOrder => {
        if (prevOrder === 'asc') {
          return 'desc';
        }

        if (prevOrder === 'desc') {
          setSortBy(null);

          return 'none';
        }

        return 'asc';
      });
    },
    [sortBy],
  );

  const getSortIcon = useCallback(
    (filterType: FilterTypesPeople) => {
      if (sortBy !== filterType || sortOrder === 'none') {
        return 'fas fa-sort';
      }

      return sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    },
    [sortBy, sortOrder],
  );

  const sortedPeople = useMemo(() => {
    if (!sortBy || sortOrder === 'none') {
      return persons;
    }

    const direction = sortOrder === 'asc' ? 1 : -1;

    return [...persons].sort((a, b) => {
      switch (sortBy) {
        case 'name': {
          const an = a.name ?? '';
          const bn = b.name ?? '';

          return an.localeCompare(bn) * direction;
        }

        case 'sex': {
          const as = a.sex ?? '';
          const bs = b.sex ?? '';

          return as.localeCompare(bs) * direction;
        }

        case 'born': {
          const av = Number.isFinite(a.born as number) ? (a.born as number) : 0;
          const bv = Number.isFinite(b.born as number) ? (b.born as number) : 0;

          return (av - bv) * direction;
        }

        case 'died': {
          const av2 = Number.isFinite(a.died as number)
            ? (a.died as number)
            : 0;
          const bv2 = Number.isFinite(b.died as number)
            ? (b.died as number)
            : 0;

          return (av2 - bv2) * direction;
        }

        default:
          return 0;
      }
    });
  }, [persons, sortBy, sortOrder]);

  const getSortLink = (filterType: FilterTypesPeople) => {
    if (sortBy !== filterType || sortOrder === 'none') {
      return '#/people';
    }

    if (sortOrder === 'asc') {
      return `#/people?sort=${filterType}`;
    }

    return `#/people?sort=${filterType}&order=desc`;
  };

  const filterTable = useMemo(() => {
    return sortedPeople.filter(p => {
      if (sexFilter !== 'all' && p.sex !== sexFilter) {
        return false;
      }

      if (
        inputFilterText &&
        !p.name?.toLowerCase().includes(inputFilterText.toLowerCase())
      ) {
        return false;
      }

      if (centuriesFilter.length > 0) {
        const century = Math.ceil(p.born / 100).toString();

        if (!centuriesFilter.includes(century)) {
          return false;
        }
      }

      return true;
    });
  }, [sortedPeople, sexFilter, inputFilterText, centuriesFilter]);

  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>
            <span
              className="is-flex is-flex-wrap-nowrap is-clickable"
              onClick={() => handleSort('name')}
            >
              Name
              <a href={getSortLink('name')}>
                <span className="icon">
                  <i className={getSortIcon('name')} />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span
              className="is-flex is-flex-wrap-nowrap is-clickable"
              onClick={() => handleSort('sex')}
            >
              Sex
              <a href={getSortLink('sex')}>
                <span className="icon">
                  <i className={getSortIcon('sex')} />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span
              className="is-flex is-flex-wrap-nowrap is-clickable"
              onClick={() => handleSort('born')}
            >
              Born
              <a href={getSortLink('born')}>
                <span className="icon">
                  <i className={getSortIcon('born')} />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span
              className="is-flex is-flex-wrap-nowrap is-clickable"
              onClick={() => handleSort('died')}
            >
              Died
              <a href={getSortLink('died')}>
                <span className="icon">
                  <i className={getSortIcon('died')} />
                </span>
              </a>
            </span>
          </th>

          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {filterTable.map(person => {
          const isSelected = person.slug === slug;

          const motherName = person.motherName?.trim();
          const fatherName = person.fatherName?.trim();

          const mother = motherName ? byName.get(motherName) : undefined;
          const father = fatherName ? byName.get(fatherName) : undefined;

          return (
            <tr
              key={person.slug}
              data-cy="person"
              className={cn({ 'has-background-warning': isSelected })}
            >
              <td>
                <Link
                  to={`/people/${person.slug ?? ''}`}
                  className={person.sex === 'f' ? 'has-text-danger' : ''}
                >
                  {person.name}
                </Link>
              </td>
              <td>{person.sex}</td>
              <td>{person.born}</td>
              <td>{person.died}</td>

              <td>
                {highlightName(person.motherName) && mother ? (
                  <PersonLink person={mother} />
                ) : (
                  person.motherName || '-'
                )}
              </td>

              <td>
                {highlightName(person.fatherName) && father ? (
                  <PersonLink person={father} />
                ) : (
                  person.fatherName || '-'
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
