import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);    // в качестве шаблона берём первый элемент из контейнера со страницами
    pages.firstElementChild.remove(); // и удаляем его (предполагаем, что там больше ничего, как вариант, можно и всё удалить из pages)
    let pageCount;
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;
        // переносим код, который делали под @todo: #2.6
        if (action) switch(action.name) {
            case 'prev': page = Math.max(1, page - 1); break;
            case 'next': page = Math.min(pageCount, page + 1); break;
            case 'first': page = 1; break;
            case 'last': page = pageCount; break;
        }
        return Object.assign({}, query, {
            limit,
            page
        });
    }
    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);
        // переносим код, который делали под @todo: #2.4
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));
        // переносим код, который делали под @todo: #2.5
        fromRow.textContent = (page - 1) * limit + 1;
        toRow.textContent = Math.min((page * limit), total);
        totalRows.textContent = total;
    }
    return {
        updatePagination,
        applyPagination
    };
}