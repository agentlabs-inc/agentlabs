import wikipedia
from langchain.chat_models import ChatOpenAI
from langchain.agents import AgentType, Tool, initialize_agent, tool, OpenAIFunctionsAgent, AgentExecutor, load_tools
from langchain.schema import SystemMessage
from agentlabs import AgentInfo, AgentLabsApp, Task
from readability import Document
import math

def wiki_summary(query) -> str:
    page = wikipedia.page(query)

    return page.content[:3000]

def wiki_search(query) -> str:
    return wikipedia.search(query)

wiki_summary_tool = Tool(
    name='wiki_summary',
    description='Browse a given wikipedia page and return its content as html. Call this tool if you know the exact name of the page you want to browse.',
    func=wiki_summary
)

wiki_search_tool = Tool(
    name='wiki_search',
    description='Searches Wikipedia for page titles that match the query. Use this tool if you are unsure of the exact name of the page you want to browse. For each returned page title you should summarize it as long as the information obtained is not sufficient.',
    func=wiki_search
)

if __name__ == '__main__':
    llm = ChatOpenAI(temperature=0)
    tools = [wiki_search_tool, wiki_summary_tool]

    # Setup AgentLabs
    agentlabs = AgentLabsApp({
        'id': 'wikipedia',
        'name': 'Wikipedia Agent',
        'logo_url': 'https://upload.wikimedia.org/wikipedia/commons/d/de/Wikipedia_Logo_1.0.png'
    })


    agent = initialize_agent(tools, llm, agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION)

    def handle_agentlabs_task(task: Task):
        print("Handling task", task)
        callback = agentlabs.make_agent_streamer(task)  

        agent.__call__(inputs=task['text'], callbacks=[callback])

    agentlabs.on_task(handle_agentlabs_task)
    agentlabs.connect()


    print('All done agentslab')
