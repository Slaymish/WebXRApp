import os
import subprocess
import pyperclip

def list_files(directory='.'):
    file_list = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_list.append(os.path.join(root, file))
    return file_list

def read_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except UnicodeDecodeError:
        return f"<Error: Unable to read file {file_path} with UTF-8 encoding>"

def write_output(file_list, output_file):
    count = 0
    with open(output_file, 'a', encoding='utf-8') as out_file:
        for file in file_list:
            if count >= 10:
                break
            out_file.write(f"{file}:\n\n")
            out_file.write(f'"""\n{read_file(file)}\n"""\n\n')
            count += 1

def generate_tree_output(directory='.'):
    try:
        result = subprocess.run(['tree', '-L', '2', directory], capture_output=True, text=True)
        return result.stdout
    except FileNotFoundError:
        return "<Error: 'tree' command not found. Please install it to use this feature.>"

if __name__ == "__main__":
    directory = input("Enter the directory to scan (default is current directory): ") or '.'
    output_file = 'output.txt'
    
    # Get the tree output
    tree_output = generate_tree_output(directory)
    
    # Write the tree output to the file
    with open(output_file, 'w', encoding='utf-8') as out_file:
        out_file.write(f"hamishburke@hamishburke ~/D/C/W/R/src (main)> tree -L 2\n{tree_output}\n")
    
    # Get the list of files and write their contents to the output file
    file_list = list_files(directory)
    write_output(file_list, output_file)
    
    print(f"Output written to {output_file}")
    
    # Ask the user if they want to copy the output to the clipboard
    copy_to_clipboard = input("Do you want to copy the output to the clipboard? (y/n): ").strip().lower()
    if copy_to_clipboard == 'y':
        with open(output_file, 'r', encoding='utf-8') as out_file:
            pyperclip.copy(out_file.read())
        print("Output copied to clipboard.")

