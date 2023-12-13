# Fluffy 🦙 API

### Steps to get the project running:
1. Download [Llama Code](https://ai.meta.com/llama/) from Meta's website.

2. Clone the [llama.cpp](https://github.com/ggerganov/llama.cpp) repo and follow directions to
    - Build the project
    - **Important**: Convert model to ggml format, quantize the model. The documentation is outdated, but this worked for me: `python3 convert.py ./models/code --outfile codellama-7b.gguf --outtype q8_0`.
    - You can verify that it works by modifying the path to your newly quantized .gguf file in the `./examples/chat.sh` script and running the script.
    
3. Install [llama-cpp-python](https://github.com/abetlen/llama-cpp-python.git) using `pip`.

4. Run the web server using this command `$ python3 -m llama_cpp.server --model api/models/code/codellama-7b.gguf`

5. Once the API is running, view specifications at http://localhost:8000/docs
    