import { useReducer, useEffect } from "react";
import { lecturers } from "../../data/lecturers";
import {
  lecturersReducer,
  ACTIONS,
  initialState,
} from "../../reducers/lecturersReducer";
import styles from "./Lecturers.module.css";

function Lecturers({ onOpenLecturer }) {
  const [state, dispatch] = useReducer(lecturersReducer, initialState);

  // Загружаем данные при первом рендере
  useEffect(() => {
    dispatch({ type: ACTIONS.SET_LECTURERS, payload: lecturers });
  }, []);

  return (
    <section className={styles.lecturers}>
      <h2>Лекторы</h2>

      <div className={styles.filtersPanel}>
        <div className={styles.filterGroup}>
          <label htmlFor="sort-select">Сортировать:</label>
          <select
            id="sort-select"
            value={state.sortBy}
            onChange={(e) => dispatch({ type: e.target.value })}
            className={styles.select}
          >
            <option value="SORT_BY_NAME">По имени</option>
            <option value="SORT_BY_EXPERIENCE">По стажу</option>
            <option value="SORT_BY_PRICE">По цене</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="experience-filter">Минимальный стаж:</label>
          <select
            id="experience-filter"
            value={state.minExperience}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.FILTER_BY_EXPERIENCE,
                payload: parseInt(e.target.value),
              })
            }
            className={styles.select}
          >
            <option value={0}>Любой</option>
            <option value={5}>От 5 лет</option>
            <option value={10}>От 10 лет</option>
            <option value={15}>От 15 лет</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="price-filter">Максимальная цена:</label>
          <select
            id="price-filter"
            value={state.maxPrice}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.FILTER_BY_PRICE,
                payload: parseInt(e.target.value),
              })
            }
            className={styles.select}
          >
            <option value={99999}>Любая</option>
            <option value={2500}>До 2500 ₽</option>
            <option value={3000}>До 3000 ₽</option>
            <option value={3500}>До 3500 ₽</option>
          </select>
        </div>

        <button
          onClick={() => dispatch({ type: ACTIONS.RESET })}
          className={styles.resetBtn}
        >
          Сбросить
        </button>
      </div>

      <div className={styles.grid}>
        {state.filteredLecturers && state.filteredLecturers.length > 0 ? (
          state.filteredLecturers.map((lecturer) => (
            <div
              key={lecturer.id}
              className={styles.card}
              onClick={() => onOpenLecturer(lecturer.id)}
            >
              <img
                src={lecturer.photo}
                alt={lecturer.name}
                className={styles.photo}
              />
              <div className={styles.info}>
                <h3>{lecturer.name}</h3>
                <p className={styles.subject}>{lecturer.subject}</p>
                <p className={styles.experience}>Стаж: {lecturer.experience}</p>
                <p className={styles.price}>{lecturer.tariffs?.[0]}</p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noResults}>Лекторы не найдены</p>
        )}
      </div>
    </section>
  );
}

export default Lecturers;
