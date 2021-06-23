import argparse

from sandbox.nsjail import NsJail


def parse_args() -> argparse.Namespace:
    """Parse the command-line arguments and return the populated namespace."""
    parser = argparse.ArgumentParser(
        prog="sandbox", usage="%(prog)s filename username [nsjail_args ...]"
    )
    parser.add_argument("filename", help="filename to evaluate")
    parser.add_argument("username", help="username")
    parser.add_argument(
        "nsjail_args", nargs="?", help="override configured NsJail options"
    )

    # nsjail_args is just a dummy for documentation purposes.
    # Its actual value comes from all the unknown arguments.
    # There doesn't seem to be a better solution with argparse.
    args, unknown = parser.parse_known_args()
    args.nsjail_args = unknown
    return args


def main() -> None:
    """Evaluate file through NsJail."""
    args = parse_args()

    # TODO: fix me
    lang = langs.get(os.path.splitext(filename)[1])

    # This language is not supported
    if lang is None:
        print(
            f"I don't know how to run `{filename}' file. Please check langs.py configuration."
        )
        exit(0)

    result = NsJail().run(username=username, filename=filename)
    print(result.stdout)


if __name__ == "__main__":
    main()
