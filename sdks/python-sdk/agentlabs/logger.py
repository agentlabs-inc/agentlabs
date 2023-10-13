from datetime import datetime

class Logger:
    def __init__(self, name: str) -> None:
        self.name = name

    def _format_log(self, level: str, message: str) -> str:
        return f"[{self.name}] {datetime.now().strftime('%m/%d/%Y, %H:%M:%S')} {level} {message}"

    def _log(self, level: str, message: str) -> None:
        print(self._format_log(level, message))

    def info(self, message: str) -> None:
        self._log("INFO", message)

    def warn(self, message: str) -> None:
        self._log("WARN", message)

    def error(self, message: str) -> None:
        self._log("ERROR", message)

    def debug(self, message: str) -> None:
        self._log("DEBUG", message)
