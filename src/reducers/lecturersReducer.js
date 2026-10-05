// Helper для извлечения стажа из строки 
const getYears = (expString) => {
  if (!expString) return 0;
  const match = expString.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

// Helper для извлечения цены из строки 
const getPrice = (tariffString) => {
  if (!tariffString) return 0;
  const match = tariffString.match(/(\d+)\s*₽/);
  return match ? parseInt(match[1]) : 0;
};

export const ACTIONS = {
  SET_LECTURERS: 'SET_LECTURERS',
  SORT_BY_NAME: 'SORT_BY_NAME',
  SORT_BY_EXPERIENCE: 'SORT_BY_EXPERIENCE',
  SORT_BY_PRICE: 'SORT_BY_PRICE',
  FILTER_BY_EXPERIENCE: 'FILTER_BY_EXPERIENCE',
  FILTER_BY_PRICE: 'FILTER_BY_PRICE',
  RESET: 'RESET',
};

const initialState = {
  lecturers: [],
  filteredLecturers: [],
  sortBy: 'SORT_BY_NAME',
  minExperience: 0,
  maxPrice: 99999,
};

export function lecturersReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SET_LECTURERS:
      return {
        ...state,
        lecturers: action.payload,
        filteredLecturers: [...action.payload].sort((a, b) => 
          a.name.localeCompare(b.name)
        ),
        sortBy: 'SORT_BY_NAME',
        minExperience: 0,
        maxPrice: 99999,
      };

    case ACTIONS.SORT_BY_NAME:
      return {
        ...state,
        sortBy: 'SORT_BY_NAME',
        filteredLecturers: [...state.filteredLecturers].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      };

    case ACTIONS.SORT_BY_EXPERIENCE:
      return {
        ...state,
        sortBy: 'SORT_BY_EXPERIENCE',
        filteredLecturers: [...state.filteredLecturers].sort((a, b) =>
          getYears(b.experience) - getYears(a.experience)
        ),
      };

    case ACTIONS.SORT_BY_PRICE:
      return {
        ...state,
        sortBy: 'SORT_BY_PRICE',
        filteredLecturers: [...state.filteredLecturers].sort((a, b) => {
          const priceA = getPrice(a.tariffs?.[0]);
          const priceB = getPrice(b.tariffs?.[0]);
          return priceA - priceB;
        }),
      };

    case ACTIONS.FILTER_BY_EXPERIENCE: {
      const minExp = action.payload;
      const filtered = state.lecturers
        .filter((lecturer) => getYears(lecturer.experience) >= minExp)
        .filter((lecturer) => {
          const price = getPrice(lecturer.tariffs?.[0]);
          return price <= state.maxPrice;
        });
      
      // Применяем текущую сортировку
      if (state.sortBy === 'SORT_BY_NAME') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (state.sortBy === 'SORT_BY_EXPERIENCE') {
        filtered.sort((a, b) => getYears(b.experience) - getYears(a.experience));
      } else if (state.sortBy === 'SORT_BY_PRICE') {
        filtered.sort((a, b) => getPrice(a.tariffs?.[0]) - getPrice(b.tariffs?.[0]));
      }
      
      return {
        ...state,
        minExperience: minExp,
        filteredLecturers: filtered,
      };
    }

    case ACTIONS.FILTER_BY_PRICE: {
      const maxPrice = action.payload;
      const filtered = state.lecturers
        .filter((lecturer) => {
          const price = getPrice(lecturer.tariffs?.[0]);
          return price <= maxPrice;
        })
        .filter((lecturer) => getYears(lecturer.experience) >= state.minExperience);
      
      // Применяем текущую сортировку
      if (state.sortBy === 'SORT_BY_NAME') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (state.sortBy === 'SORT_BY_EXPERIENCE') {
        filtered.sort((a, b) => getYears(b.experience) - getYears(a.experience));
      } else if (state.sortBy === 'SORT_BY_PRICE') {
        filtered.sort((a, b) => getPrice(a.tariffs?.[0]) - getPrice(b.tariffs?.[0]));
      }
      
      return {
        ...state,
        maxPrice: maxPrice,
        filteredLecturers: filtered,
      };
    }

    case ACTIONS.RESET:
      return {
        ...state,
        sortBy: 'SORT_BY_NAME',
        minExperience: 0,
        maxPrice: 99999,
        filteredLecturers: [...state.lecturers].sort((a, b) => 
          a.name.localeCompare(b.name)
        ),
      };

    default:
      return state;
  }
}

export { initialState };