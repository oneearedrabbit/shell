import argparse

from sandbox.nsjail import NsJail


def parse_args() -> argparse.Namespace:
    """Parse the command-line arguments and return the populated namespace."""
    parser = argparse.ArgumentParser(
        prog="sandbox", usage="%(prog)s username filename"
    )
    parser.add_argument("username", help="username")
    parser.add_argument("filename", help="filename to evaluate")

    args = parser.parse_known_args()
    return args


def main() -> None:
    """Evaluate file through NsJail."""
    args = parse_args()

    result = NsJail().run(username=args.username, filename=args.filename)
    print(result.stdout)


if __name__ == "__main__":
    main()
