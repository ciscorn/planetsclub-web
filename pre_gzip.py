import gzip
from glob import glob
import os.path

EXTENSIONS = {".js", ".css", ".svg"}


total_original = 0
total_compressed = 0


def sizefmt(num, suffix="B"):
    for unit in ["", "k", "M", "G", "T", "P", "E", "Z"]:
        if abs(num) < 1024.0:
            return "%3.1f %s%s" % (num, unit, suffix)
        num /= 1024.0
    return "%.1f%s%s" % (num, "Yi", suffix)


for path in glob("./.nuxt/dist/client/**/*", recursive=True):
    ext = os.path.splitext(path)[1]
    if ext in EXTENSIONS:
        with open(path, "rb") as f:
            data = f.read()
            len_orig = len(data)
            if len_orig < 400:
                total_original += len_orig
                total_compressed += len_orig
                continue

            compressed = gzip.compress(data)
            len_comp = len(compressed)

            print(
                "pre-gzip: {3} {0} -> {1} ({2:.1%})".format(
                    sizefmt(len_orig),
                    sizefmt(len_comp),
                    len_comp / len_orig,
                    os.path.relpath(path, "./.nuxt/dist/client/"),
                )
            )

            total_original += len_orig
            total_compressed += len_comp

        with open(path + ".gz", "wb") as f:
            f.write(compressed)

print(
    "pre-gzip total: {0} -> {1} ({2:.1%})".format(
        sizefmt(total_original),
        sizefmt(total_compressed),
        total_compressed / total_original,
    )
)
