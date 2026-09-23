---
title: "我做出了自己的第一個 LLM application！"
tags: ["ai"]
date: "2026-09-23"
---

這是一個 JD (Job Description) extractor，把一個工作職缺的 JD 丟給這個 app，他就可以幫你抓出所有你想要的欄位，例如：職稱，公司名稱，地點，技術棧，前端的比例，on call 需求，AI 需求等等，並且回應一個結構化的 JSON。

## 創造一個 API Client

首先設置環境變數 `ANTHROPIC_API_KEY`，並且在程式碼中引用 Anthropic SDK：

```python
from dotenv import load_dotenv
load_dotenv()

from anthropic import Anthropic

client = Anthropic()
model = "claude-sonnet-4-5"
```

送出第一個訊息請求非常簡單，只要呼叫 `client.messages.create()`：

```python
message = client.messages.create(
    model=model,
    max_tokens=1000,
    messages=[
        {
            "role": "user",
            "content": "Extract the job fields from the following job description:\n\n" + job_description
        }
    ]
)
```

`messages` 就是對話紀錄，有分成 User Message 和 Assistant Message 兩種。

## 保存訊息紀錄

要特別注意的觀念是，Claude 不會儲存我們的對話紀錄，所以我們必須自己將對話紀錄保存在應用程式的狀態中。

假設我們發了一個問題，Claude 回答了，我們還想要再問一個 follow up question，這時候我們必須把完整的對話紀錄發送給 Claude，它才會知道前面我們已經聊了些什麼。

以下是實作對話紀錄的簡單方式。

首先我們會需要一些 helper function，幫助我們保存 user message 和 assistant message：

```python
def add_user_message(messages, text):
    user_message = {"role": "user", "content": text}
    messages.append(user_message)

def add_assistant_message(messages, text):
    assistant_message = {"role": "assistant", "content": text}
    messages.append(assistant_message)

def chat(messages):
    message = client.messages.create(
        model=model,
        max_tokens=1000,
        messages=messages,
    )
    return message.content[0].text
```

在收到第一則回應以後，就將答案加進 `messages` 裡。

這樣一來，我們就可以形成完整的來回對話：

```python
# Start with an empty message list
messages = []

# Add the initial user question
add_user_message(messages, "Extract the job fields from the following job description:\n\n" + job_description)

# Get Claude's response
answer = chat(messages)

# Add Claude's response to the conversation history
add_assistant_message(messages, answer)

# Add a follow-up question
add_user_message(messages, "Explain how you infer frontend_percent.")

# Get the follow-up response with full context
final_answer = chat(messages)
```

## System Prompts

System Prompt 可以用來設定 Claude 在這個應用程式中的角色、行為與回應方式。

以下是我的 JD extractor 的 system prompt：

```
You are a JD extractor.
Given a job description, you will extract the following fields:
- job_title: The title of the job position.
- company: The name of the company offering the job.
- location: The location of the job.
- frontend_percent: The percentage of the job that involves frontend development (0-100).
- frontend_percent_inferred: A boolean indicating whether the frontend_percent was inferred or explicitly stated.
- on_call: A string indicating whether the job requires on-call duties ("yes", "no", or "not_mentioned").
- on_call_details: Additional details about on-call duties, if mentioned.
- tech_stack: A list of technologies and programming languages required for the job.
- ai_requirement: An object containing:
  - level: A string indicating the level of AI requirement ("required", "preferred", "mentioned", or "not_mentioned").
  - details: A list of specific AI-related skills or requirements mentioned in the job description.
```

如果你有用 Claude Code 或是 Codex 等其他 coding agent，也可以自己草擬 prompt 再請 agent 幫你修改。（上面是 Claude Code 幫我生成的！）

最後，在送出的訊息附上 `system` 變數，就完成角色設定了。

```python

system_prompt = """
You are a JD extractor.
...
"""

client.messages.create(
    model=model,
    messages=messages,
    max_tokens=1000,
    system=system_prompt
)
```

## 心得

身為一個前端工程師，總覺得「做一個 LLM application」是離我很遙遠的事情，沒想到套一下 API 其實並不難。

實作的過程中，也才慢慢了解，平時使用的 coding agent 背後是如何運作的。

另一個有趣的發現是，在學習的過程中，我曾經請 Claude Code 幫我生成完整的程式碼，功能十分完整，但是我卻覺得自己沒有學到東西。

後來換成自己照著 tutorial 一步一步手寫，才總算有比較吸收進去的感覺。

或許在什麼事都可以請 AI 代勞的時代，唯有學習這件事是沒有辦法外包給 AI 的。手寫程式碼，在學習方面還是有其價值。

## Reference

* [Building with the Claude API](https://academy.claude.com/courses/building-with-the-claude-api)