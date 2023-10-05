from datetime import datetime

class AgentLogger:
    def __init__(self, agent_id: str, name: str) -> None:
        self.agent_id = agent_id
        self.name = name

    def _format_log(self, level: str, message: str) -> str:
        return f"[{self.agent_id}] [{self.name}] {datetime.now().strftime('%m/%d/%Y, %H:%M:%S')} {level} {message}"

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
