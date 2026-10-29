#!/usr/bin/env python3

import json
import re
import sys
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import URLError
from urllib.request import Request, urlopen


SOURCE_URL = (
    "https://treizemondial.fr/"
    "classement-division-nationale-2-phase-1-2026-2027/"
)
OUTPUT_FILE = Path("data/standings-dn2-ouest.json")
HEADERS = ["#", "Équipe", "Pts", "J", "V", "N", "D", "Diff"]


class WestStandingsParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_west_section = False
        self.in_standings_table = False
        self.table_depth = 0
        self.current_row = None
        self.current_cell = None
        self.rows = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)

        if tag == "a" and attributes.get("id") == "Ouest":
            self.in_west_section = True
        elif tag == "a" and attributes.get("id") == "Est":
            self.in_west_section = False

        if tag == "table" and self.in_west_section:
            if not self.in_standings_table:
                self.in_standings_table = True
            self.table_depth += 1
        elif self.in_standings_table and tag == "tr":
            self.current_row = []
        elif self.in_standings_table and tag in ("td", "th"):
            self.current_cell = []

    def handle_data(self, data):
        if self.current_cell is not None:
            self.current_cell.append(data)

    def handle_endtag(self, tag):
        if self.in_standings_table and tag in ("td", "th"):
            if self.current_row is not None and self.current_cell is not None:
                cell_text = " ".join("".join(self.current_cell).split())
                self.current_row.append(cell_text)
            self.current_cell = None
        elif self.in_standings_table and tag == "tr":
            if self.current_row:
                self.rows.append(self.current_row)
            self.current_row = None
        elif self.in_standings_table and tag == "table":
            self.table_depth -= 1
            if self.table_depth == 0:
                self.in_standings_table = False
                self.in_west_section = False


def parse_standings(page):
    parser = WestStandingsParser()
    parser.feed(page)
    if not parser.rows or parser.rows[0] != HEADERS:
        raise ValueError("Le tableau de la Poule Ouest est introuvable ou a changé.")

    standings = []
    for row in parser.rows[1:]:
        if len(row) != len(HEADERS):
            raise ValueError(f"Ligne de classement inattendue : {row!r}")

        try:
            position = int(row[0].rstrip("."))
            numeric_values = [int(value) for value in row[2:]]
        except ValueError as error:
            raise ValueError(f"Valeurs de classement invalides : {row!r}") from error

        team = row[1].strip()
        if not team:
            raise ValueError("Une équipe du classement n'a pas de nom.")

        standings.append(
            {
                "position": position,
                "team": team,
                "points": numeric_values[0],
                "played": numeric_values[1],
                "wins": numeric_values[2],
                "draws": numeric_values[3],
                "losses": numeric_values[4],
                "difference": numeric_values[5],
            }
        )

    if not standings or [row["position"] for row in standings] != list(
        range(1, len(standings) + 1)
    ):
        raise ValueError("Les positions de la Poule Ouest sont incomplètes.")

    update_match = re.search(
        r"Classements\s+mis\s+à\s+jour\s+le\s+([^<]+)",
        page,
        flags=re.IGNORECASE,
    )
    source_updated = (
        unescape(update_match.group(1)).strip().rstrip(".")
        if update_match
        else None
    )

    return {
        "sourceUrl": SOURCE_URL,
        "sourceUpdated": source_updated,
        "retrievedAt": datetime.now(timezone.utc)
        .isoformat(timespec="seconds")
        .replace("+00:00", "Z"),
        "standings": standings,
    }


def main():
    request = Request(
        SOURCE_URL,
        headers={"User-Agent": "Basque-XIII-standings/1.0"},
    )

    try:
        with urlopen(request, timeout=30) as response:
            page = response.read().decode("utf-8")
        result = parse_standings(page)
        OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT_FILE.write_text(
            json.dumps(result, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    except (OSError, UnicodeDecodeError, URLError, ValueError) as error:
        print(f"Impossible de récupérer le classement Treize Mondial : {error}", file=sys.stderr)
        return 1

    print(f"Classement Ouest récupéré : {len(result['standings'])} équipes.")
    print(f"Mis à jour par la source : {result['sourceUpdated'] or 'date non indiquée'}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
