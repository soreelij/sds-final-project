
import streamlit as st
import replicate
import os

#######################################
## Steps: ##
# Replicate steps:
# Get a Replicate API token
# 1. Go to https://replicate.com/signin/.
# 2. Sign in with your GitHub account.
# 3. Proceed to the API tokens page and copy your API token. (note should startt with `r8_xxxxxx`)
# 
# Local Development
# 1. `pip install streamlit replicate` (note Python version 3.8 or higher pre-installed.)
# 2. `pip install replicate`
# 
# Run App (perferably in env) in directory using terminmal:
# 1. `streamlit run llamaChatBot.py`
#######################################

# App title
st.set_page_config(page_title="Llama 2 Chatbot")

# Replicate Credentials
with st.sidebar:
    st.title('Llama 2 Chatbot')
    replicate_api = 'REPLACE_WITH_YOUR_TOKEN'
    os.environ['REPLICATE_API_TOKEN'] = replicate_api

# Store LLM generated responses
if "messages" not in st.session_state.keys():
    st.session_state.messages = [{"role": "assistant", "content": "How may I assist you today? If I have a glitch, please RESET me."}]

# Display or clear chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"])

def clear_chat_history():
    st.session_state.messages = [{"role": "assistant", "content": "How may I assist you today? If I have a glitch, please RESET me."}]
st.sidebar.button('Restart Chatbot', on_click=clear_chat_history)

# Function for generating LLaMA2 response. Refactored from https://github.com/a16z-infra/llama2-chatbot
def generate_llama2_response(prompt_input):
    string_dialogue = "You are a helpful assistant. You do not respond as 'User' or pretend to be 'User'. You only respond once as 'Assistant'."
    for dict_message in st.session_state.messages:
        if dict_message["role"] == "user":
            string_dialogue += "User: " + dict_message["content"] + "\n\n"
        else:
            string_dialogue += "Assistant: " + dict_message["content"] + "\n\n"
    output = replicate.run('a16z-infra/llama7b-v2-chat:4f0a4744c7295c024a1de15e1a63c880d3da035fa1f49bfd344fe076074c8eea', 
                           input={"prompt": f"{string_dialogue} {prompt_input} Assistant: ",
                                  "temperature":0.1, "top_p":0.9, "max_length":512, "repetition_penalty":1})
    return output

# User-provided prompt
replicate_api = 'r8_A9RzwYKkd3DC0uWjLtnGjzNlc2ztB2q0C72CO'
if prompt := st.chat_input(disabled=not replicate_api):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

# Generate a new response if last message is not from assistant
if st.session_state.messages[-1]["role"] != "assistant":
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            response = generate_llama2_response(prompt)
            placeholder = st.empty()
            full_response = ''
            for item in response:
                full_response += item
                placeholder.markdown(full_response)
            placeholder.markdown(full_response)
    message = {"role": "assistant", "content": full_response}
    st.session_state.messages.append(message)