def chunk_str(input_string, chunk_size):
    return [input_string[i:i + chunk_size] for i in range(0, len(input_string), chunk_size)]
