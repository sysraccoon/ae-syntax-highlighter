import json
import click

from pygments.lexers import guess_lexer, get_lexer_by_name, get_all_lexers
from pygments.token import Token


@click.group()
def cli():
    pass


@cli.command()
@click.option(
    "--pretty/--no-pretty", is_flag=True, default=False, show_default=True,
    help="Add (or not) indentation to output json",
)
def list_languages(pretty):
    languages = [
        {
            "long_name": long_name,
            "aliases": aliases
        } for (
            long_name,
            aliases,
            _file_patterns,
            _mime_types,
        ) in get_all_lexers()
        if aliases
    ]

    print(format_output(languages, pretty))


@cli.command()
@click.argument("src", type=click.File("r"))
@click.argument("dst", type=click.File("w"))
@click.option(
    "--language", default=None, show_default=True,
    help="Specify source programming language",
)
@click.option(
    "--pretty/--no-pretty", is_flag=True, default=False, show_default=True,
    help="Add (or not) indentation to output json",
)
@click.option(
    "--count-eol/--no-count-eol", is_flag=True, default=True, show_default=True,
    help="If enabled, the end-of-line character participates " +
    "in the calculation of the 'start' and 'end' index",
)
def tokenize(src, dst, language, pretty, count_eol):
    code = src.read()
    tokens = tokenize(code, language, count_eol)

    output = format_output(tokens, pretty)
    dst.write(output)

token_mapping = {
    Token.Literal.String: "string",
    Token.Literal.Number: "number",
    Token.Operator: "operator",
    Token.Comment: "comment",
    Token.Name.Function: "function",
    Token.Keyword: "keyword",
    Token.Name: "name",
}


def map_pygments_token(token):
    for token_map_type, token_map_value in token_mapping.items():
        if token in token_map_type:
            return token_map_value


def format_output(output, pretty):
    return json.dumps(output, indent=4 if pretty else None)


def tokenize(code, language=None, count_eol=True):
    parsed_tokens = []
    lexer = get_lexer_by_name(language) if language else guess_lexer(code)

    unprocessed_tokens = lexer.get_tokens_unprocessed(code)
    if not count_eol:
        unprocessed_tokens = exclude_eol_from_offsets(unprocessed_tokens)

    for token in unprocessed_tokens:
        offset, token_type, value = token

        mapped_token = map_pygments_token(token_type)
        if not mapped_token:
            continue

        parsed_tokens.append(dict(
            start=offset,
            end=offset + len(value),
            value=value,
            type=mapped_token,
        ))

    return parsed_tokens


def exclude_eol_from_offsets(unprocessed_tokens):
    eol_offset = 0

    for offset, token_type, value in unprocessed_tokens:
        if token_type in Token.Text.Whitespace and value in ["\n", "\r", "\r\n"]:
            eol_offset += len(value)
            continue
        
        offset -= eol_offset
        yield (offset, token_type, value)


if __name__ == "__main__":
    cli()
