import { useEffect, useState, useMemo } from 'react';
import { getPeople } from '../api';
import { Person } from '../types/Person';

import { PeopleFilters } from './PeopleFilters';
import { Loader } from './Loader';
import { PeopleTable } from './PeopleTable';

import SexFilter from '../types/SexFilter';

export const PeoplePage = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [sexFilter, setSexFilter] = useState<SexFilter>('all');
  const [inputFilterText, setInputFilterText] = useState<string>('');
  const [centuriesFilter, setCenturiesFilter] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);

    getPeople()
      .then(data => setPersons(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filteredPersons = useMemo(() => {
    return persons.filter(p => {
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
  }, [persons, sexFilter, inputFilterText, centuriesFilter]);

  const errorFinding =
    filteredPersons.length === 0 && inputFilterText.trim() !== '';

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          {!loading && !error ? (
            <div className="column is-7-tablet is-narrow-desktop">
              <PeopleFilters
                sexFilter={sexFilter}
                setSexFilter={setSexFilter}
                centuriesFilter={centuriesFilter}
                setCenturiesFilter={setCenturiesFilter}
                inputFilterText={inputFilterText}
                setInputFilterText={setInputFilterText}
              />
            </div>
          ) : null}

          <div className="column">
            <div className="box table-container">
              {error ? (
                <p data-cy="peopleLoadingError" className="has-text-danger">
                  Something went wrong
                </p>
              ) : null}

              {persons.length === 0 && !error && !loading && (
                <p data-cy="noPeopleMessage" className="has-text-danger">
                  There are no people on the server
                </p>
              )}

              {errorFinding ? (
                <p>There are no people matching the current search criteria</p>
              ) : (
                !loading &&
                !error && (
                  <PeopleTable
                    persons={filteredPersons}
                    sexFilter={sexFilter}
                    inputFilterText={inputFilterText}
                    centuriesFilter={centuriesFilter}
                  />
                )
              )}

              {loading && <Loader />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
