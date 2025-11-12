import SexFilter from '../types/SexFilter';

type FilterProps = {
  sexFilter: SexFilter;
  setSexFilter: React.Dispatch<React.SetStateAction<SexFilter>>;
  inputFilterText: string;
  setInputFilterText: React.Dispatch<React.SetStateAction<string>>;
  centuriesFilter: string[];
  setCenturiesFilter: React.Dispatch<React.SetStateAction<string[]>>;
};

export const PeopleFilters = ({
  sexFilter,
  setSexFilter,
  centuriesFilter,
  setCenturiesFilter,
  inputFilterText,
  setInputFilterText,
}: FilterProps) => {
  const handleAddCentury = (century: string) => {
    if (centuriesFilter.includes(century)) {
      setCenturiesFilter(centuriesFilter.filter(c => c !== century));
    } else {
      setCenturiesFilter([...centuriesFilter, century]);
    }
  };

  const resetFilters = () => {
    setSexFilter('all');
    setInputFilterText('');
    setCenturiesFilter([]);
  };

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs" data-cy="SexFilter">
        <a
          className={`${sexFilter === 'all' ? 'is-active' : ''}`}
          onClick={setSexFilter.bind(null, 'all')}
          href="#/people"
        >
          All
        </a>
        <a
          className={`${sexFilter === 'm' ? 'is-active' : ''}`}
          onClick={setSexFilter.bind(null, 'm')}
          href="#/people?sex=m"
        >
          Male
        </a>
        <a
          className={`${sexFilter === 'f' ? 'is-active' : ''}`}
          onClick={setSexFilter.bind(null, 'f')}
          href="#/people?sex=f"
        >
          Female
        </a>
      </p>

      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            data-cy="NameFilter"
            type="search"
            className="input"
            placeholder="Search"
            value={inputFilterText}
            onChange={e => setInputFilterText(e.target.value)}
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>
        </p>
      </div>

      <div className="panel-block">
        <div className="level is-flex-grow-1 is-mobile" data-cy="CenturyFilter">
          <div className="level-left">
            <a
              data-cy="century"
              href="#/people?centuries=16"
              className={`button mr-1 ${centuriesFilter.includes('16') ? 'is-info' : ''}`}
              onClick={() => {
                handleAddCentury('16');
              }}
            >
              16
            </a>

            <a
              data-cy="century"
              href="#/people?centuries=17"
              className={`button mr-1 ${centuriesFilter.includes('17') ? 'is-info' : ''}`}
              onClick={() => {
                handleAddCentury('17');
              }}
            >
              17
            </a>

            <a
              data-cy="century"
              href="#/people?centuries=18"
              className={`button mr-1 ${centuriesFilter.includes('18') ? 'is-info' : ''}`}
              onClick={() => {
                handleAddCentury('18');
              }}
            >
              18
            </a>

            <a
              data-cy="century"
              href="#/people?centuries=19"
              className={`button mr-1 ${centuriesFilter.includes('19') ? 'is-info' : ''}`}
              onClick={() => {
                handleAddCentury('19');
              }}
            >
              19
            </a>

            <a
              data-cy="century"
              href="#/people?centuries=20"
              className={`button mr-1 ${centuriesFilter.includes('20') ? 'is-info' : ''}`}
              onClick={() => {
                handleAddCentury('20');
              }}
            >
              20
            </a>
          </div>

          <div className="level-right ml-4">
            <a
              data-cy="centuryALL"
              className={`button is-success ${centuriesFilter.length > 0 ? 'is-outlined' : ''}`}
              href="#/people"
              onClick={setCenturiesFilter.bind(null, [])}
            >
              All
            </a>
          </div>
        </div>
      </div>

      <div className="panel-block">
        <a
          className="button is-link is-outlined is-fullwidth"
          href="#/people"
          onClick={() => resetFilters()}
        >
          Reset all filters
        </a>
      </div>
    </nav>
  );
};
