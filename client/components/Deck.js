import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  Button,
  ButtonSet,
  DataTable,
  Loading,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  Search,
  Stack,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarMenu,
  TableToolbarSearch,
  Tag,
  Tile,
} from "carbon-components-react";

import {
  Close,
  Edit,
  Menu,
  PlayOutline,
  PauseOutline,
  TrashCan,
} from "@carbon/icons-react";

import filterable from "filterable";

import { debounce, matchesProperty } from "lodash";

import classNames from "classnames";

import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

import Error from "./Error";

import useCards from "../hooks/useCards";
import useDeck from "../hooks/useDeck";

import useDeleteCards from "../hooks/useDeleteCards";
import useUpdateCards from "../hooks/useUpdateCards";

import { isDueEarlier, isPaused } from "../spacedRepetition";

dayjs.extend(relativeTime);

const headers = [
  {
    key: "front",
    header: "Front",
  },
  {
    key: "back",
    header: "Back",
  },
  {
    key: "dueDate",
    header: "Due",
  },
  {
    key: "created",
    header: "Created",
  },
  {
    key: "tags",
    header: "Tags",
  },
];

export default function Deck() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const { deckId } = useParams();

  const {
    cards = [],
    error: cardsError,
    isFetching: isFetchingCards,
  } = useCards(deckId);

  const {
    deck,
    error: deckError,
    isFetching: isFetchingDeck,
  } = useDeck(deckId);

  const error = cardsError || deckError;
  const isFetching = isFetchingCards || isFetchingDeck;

  const onEdit = (cardId) => {
    navigate(`./cards/${cardId}/update`);
  };

  const onDelete = useDeleteCards(deckId);

  const onBatchDelete = (rows) => () => {
    const cardIds = rows.map(({ id }) => id);

    onDelete(cardIds);
  };

  const updateCards = useUpdateCards(deckId);

  const onPause = (cardId) => updateCards({ [cardId]: { paused: true } });

  const onBatchPause = (rows) => async () => {
    const cardIds = rows.map(({ id }) => id);

    const options = cardIds.reduce((options, cardId) => {
      return {
        ...options,
        [cardId]: { paused: true },
      };
    }, {});

    updateCards(options);
  };

  const onResume = (cardId) => updateCards({ [cardId]: { paused: false } });

  const onBatchResume = (rows) => async () => {
    const cardIds = rows.map(({ id }) => id);

    const options = cardIds.reduce((options, cardId) => {
      return {
        ...options,
        [cardId]: { paused: false },
      };
    }, {});

    updateCards(options);
  };

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [filteredCards, setFilteredCards] = useState(cards);

  const onSearchInput = useCallback(
    ({ target }) => {
      const { value: search = null } = target;

      setSearch(search);
    },
    [setSearch]
  );

  const filterCardsOnCardsChanged = useCallback(
    (cards) => {
      setFilteredCards(filterCards(cards, search));
    },
    [search, setFilteredCards]
  );

  useEffect(() => filterCardsOnCardsChanged(cards), [cards]);

  const filterCardsOnSearchChanged = useCallback(
    debounce(
      (cards, search) => setFilteredCards(filterCards(cards, search)),
      300
    ),
    [setFilteredCards]
  );

  useEffect(() => filterCardsOnSearchChanged(cards, search), [cards, search]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) {
      params.append("search", search);
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  }, [history, search]);

  const onPaginationChange = ({ page: newPage, pageSize: newPageSize }) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const paginatedCards = useMemo(() => {
    const actualPage = page - 1;

    return filteredCards.slice(
      actualPage * pageSize,
      actualPage * pageSize + pageSize
    );
  }, [filteredCards, page, pageSize]);

  const rows = useMemo(() => {
    return paginatedCards.map((card) => ({
      ...card,
      id: card._id,
    }));
  }, [paginatedCards]);

  if (error) {
    return <Error error={error} />;
  }

  if (isFetching) {
    return <Loading />;
  }

  const sortRow = (a, b, options) => {
    const { key, sortDirection, sortStates } = options;

    const direction = sortDirection === sortStates.DESC ? 1 : -1;

    if (key === "created" || key === "dueDate") {
      if (isDueEarlier(a, b)) {
        return -1 * direction;
      }

      return 1 * direction;
    }

    if (a > b) {
      return -1 * direction;
    }

    return direction;
  };

  const hasCardsDue = deck.cardsCount.due > 0;

  return (
    <Stack gap={6} className="deck">
      <div className="page__header">
        <h1>{deck.name}</h1>
        <ButtonSet>
          <Button
            className="deck__edit-button"
            kind="ghost"
            renderIcon={Edit}
            iconDescription="Edit deck"
            tooltipPosition="right"
            hasIconOnly
            onClick={() => navigate(`/decks/${deck._id}/update`)}
          />
          <Button
            renderIcon={Close}
            kind="secondary"
            iconDescription="Exit"
            tooltipPosition="right"
            hasIconOnly
            onClick={() => navigate(`/`)}
          ></Button>
        </ButtonSet>
      </div>
      <ButtonSet className="full-width-buttons">
        <Button
          className="deck__practice-button full-width-buttons__button"
          kind={hasCardsDue ? "danger" : "primary"}
          onClick={() => navigate(`/decks/${deck._id}/practice`)}
        >
          Practice
          {hasCardsDue ? (
            <span className="deck__practice-button-number">
              {deck.cardsCount.due}
              <Menu style={{ justifySelf: "flex-end" }} size={18} />
            </span>
          ) : null}
        </Button>
        <Button
          className="show-at-sm full-width-buttons__button"
          onClick={() => navigate(`/create-card?deck=${deckId}`)}
        >
          Create Card
        </Button>
      </ButtonSet>
      <h2>Cards</h2>
      {cards.length ? (
        <DataTable rows={rows} headers={headers} isSortable sortRow={sortRow}>
          {({
            getBatchActionProps,
            getHeaderProps,
            getRowProps,
            getSelectionProps,
            getToolbarProps,
            headers,
            rows,
            selectedRows,
          }) => {
            const batchActionProps = getBatchActionProps();

            return (
              <TableContainer className="hide-at-sm">
                <TableToolbar {...getToolbarProps()} aria-label="Toolbar">
                  <TableBatchActions {...batchActionProps}>
                    <TableBatchAction
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? 0 : -1
                      }
                      renderIcon={TrashCan}
                      onClick={onBatchDelete(selectedRows)}
                    >
                      Delete
                    </TableBatchAction>
                    <TableBatchAction
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? 0 : -1
                      }
                      renderIcon={PauseOutline}
                      onClick={onBatchPause(selectedRows)}
                    >
                      Pause Practicing
                    </TableBatchAction>
                    <TableBatchAction
                      tabIndex={
                        batchActionProps.shouldShowBatchActions ? 0 : -1
                      }
                      renderIcon={PlayOutline}
                      onClick={onBatchResume(selectedRows)}
                    >
                      Resume Practicing
                    </TableBatchAction>
                  </TableBatchActions>
                  <TableToolbarContent>
                    <TableToolbarSearch
                      spellCheck={false}
                      persistent={true}
                      onChange={onSearchInput}
                      value={search || ""}
                    />
                    {false ? (
                      <TableToolbarMenu light>
                        <TableToolbarAction onClick={() => console.log("Foo")}>
                          Foo
                        </TableToolbarAction>
                      </TableToolbarMenu>
                    ) : null}
                    <Button
                      onClick={() => navigate(`/create-card?deck=${deckId}`)}
                    >
                      Create Card
                    </Button>
                  </TableToolbarContent>
                </TableToolbar>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableSelectAll {...getSelectionProps()} />
                      {headers.map((header) => (
                        <TableHeader
                          className={classNames({
                            "show-at-lg": [
                              "created",
                              "dueDate",
                              "tags",
                            ].includes(header.key),
                            "no-pointer-events": header.key === "tags",
                          })}
                          {...getHeaderProps({ header })}
                        >
                          {header.header}
                        </TableHeader>
                      ))}
                      <TableHeader />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => {
                      const card = cards.find(matchesProperty("_id", row.id));

                      if (!card) {
                        return null;
                      }

                      const paused = isPaused(card);

                      return (
                        <TableRow {...getRowProps({ row })}>
                          <TableSelectRow {...getSelectionProps({ row })} />
                          {row.cells.map((cell) => {
                            if (cell.info.header === "created") {
                              return <CreatedCell key="created" card={card} />;
                            } else if (cell.info.header === "dueDate") {
                              return <DueCell key="due" card={card} />;
                            } else if (cell.info.header === "tags") {
                              return (
                                <TagsCell
                                  key="tags"
                                  card={card}
                                  onClickTag={(tag) => setSearch(`tag:${tag}`)}
                                />
                              );
                            }

                            return (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            );
                          })}
                          <TableCell className="cds--table-column-menu">
                            <OverflowMenu size="sm" flipped ariaLabel="">
                              <OverflowMenuItem
                                onClick={() => onEdit(row.id)}
                                itemText="Edit"
                              ></OverflowMenuItem>
                              <OverflowMenuItem
                                onClick={() => onDelete([row.id])}
                                itemText="Delete"
                              ></OverflowMenuItem>
                              <OverflowMenuItem
                                onClick={
                                  paused
                                    ? () => onResume(row.id)
                                    : () => onPause(row.id)
                                }
                                itemText={
                                  paused
                                    ? "Resume practicing"
                                    : "Pause practicing"
                                }
                              ></OverflowMenuItem>
                            </OverflowMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          }}
        </DataTable>
      ) : (
        <Tile>
          <Stack gap={6}>
            <h2>No cards</h2>
            <Button onClick={() => navigate(`/create-card?deck=${deckId}`)}>
              Create Card
            </Button>
          </Stack>
        </Tile>
      )}
      {cards.length ? (
        <>
          <Search
            value={search || ""}
            className="show-at-sm"
            size="lg"
            labelText="Search"
            closeButtonLabelText="Clear search input"
            id="search-1"
            onChange={onSearchInput}
            onKeyDown={onSearchInput}
          />
          {paginatedCards.map((card) => {
            return (
              <Stack
                key={card._id}
                onClick={() => onEdit(card._id)}
                gap={1}
                className="card-sm show-at-sm"
              >
                <Tile className="card-sm__front">
                  <h5>{card.front}</h5>
                </Tile>
                <Tile className="card-sm__back">
                  <h5>{card.back}</h5>
                </Tile>
                {card.tags?.length ? (
                  <Tile>
                    {card.tags.map((tag) => {
                      return (
                        <Tag
                          key={tag}
                          onClick={(event) => {
                            event.stopPropagation();

                            setSearch(`tag:${tag}`);
                          }}
                          style={{ border: "none", lineHeight: 1 }}
                          size="md"
                          type="gray"
                        >
                          {tag}
                        </Tag>
                      );
                    })}
                  </Tile>
                ) : null}
              </Stack>
            );
          })}
        </>
      ) : null}
      <Pagination
        backwardText="Previous page"
        forwardText="Next page"
        itemsPerPageText="Items per page:"
        onChange={onPaginationChange}
        page={page}
        pageSize={pageSize}
        pageSizes={[10, 20, 30, 40, 50]}
        size="md"
        totalItems={filteredCards.length}
      />
    </Stack>
  );
}

function CreatedCell(props) {
  const { card } = props;

  const { created } = card;

  return (
    <TableCell className="show-at-lg">{dayjs(created).fromNow()}</TableCell>
  );
}

function DueCell(props) {
  const { card } = props;

  const { dueDate, paused } = card;

  let content = "-";

  if (paused) {
    content = <PauseOutline />;
  } else if (dueDate) {
    content = dayjs(dueDate).fromNow();
  }

  return <TableCell className="show-at-lg">{content}</TableCell>;
}

function TagsCell(props) {
  const { card, onClickTag } = props;

  let { tags = [] } = card;

  tags = tags.filter((tag) => tag && tag.length).sort();

  if (tags.length > 3) {
    tags = [...tags.slice(0, 3), "..."];
  }

  return (
    <TableCell className="show-at-lg">
      {tags.map((tag) => (
        <Tag
          key={tag}
          onClick={() => onClickTag(tag)}
          style={{ border: "none", lineHeight: 1 }}
          size="md"
          type="gray"
        >
          {tag}
        </Tag>
      ))}
    </TableCell>
  );
}

function filterCards(cards, search) {
  if (!search || !search.length) return cards;

  const query = filterable.Query(search).parse().toJSON();

  return cards.filter((card) => {
    let ok = true;

    for (let filter of query) {
      if (filter.type === "in" && filter.field === "tags") {
        if (
          !card.front.toLowerCase().includes(filter.value.toLowerCase()) &&
          !card.back.toLowerCase().includes(filter.value.toLowerCase())
        ) {
          ok = false;
        }
      }

      if (filter.type === "=" && filter.field === "tag") {
        if (
          !card.tags.some((tag) =>
            tag.toLowerCase().includes(filter.value.toLowerCase())
          )
        ) {
          ok = false;
        }
      }
    }

    return ok;
  });
}
