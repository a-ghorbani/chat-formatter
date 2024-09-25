import { TemplateConfig } from '../types';

const llama32Template: TemplateConfig = {
  bosToken: '<|begin_of_text|>',
  eosToken: '<|eot_id|>',
  addBosToken: false,
  addEosToken: false,
  // prettier-ignore
  chatTemplate: 
    "{{- bos_token }}" +
    "{%- if custom_tools is defined %}" +
        "{%- set tools = custom_tools %}" +
    "{%- endif %}" +
    "{%- if tools_in_user_message is not defined %}" +
        "{%- set tools_in_user_message = true %}" +
    "{%- endif %}" +
    "{%- if date_string is not defined %}" +
        "{%- if strftime_now is defined %}" +
            "{%- set date_string = strftime_now('%d %b %Y') %}" +
        "{%- else %}" +
            "{%- set date_string = '26 Jul 2024' %}" +
        "{%- endif %}" +
    "{%- endif %}" +
    "{%- if tools is not defined %}" +
        "{%- set tools = none %}" +
    "{%- endif %}" +

    "{#- This block extracts the system message, so we can slot it into the right place. #}" +
    "{%- if messages[0]['role'] == 'system' %}" +
        "{%- set system_message = messages[0]['content'] | trim %}" +   // Added space around the pipe operator
        "{%- set messages = messages.slice(1) %}" +
    "{%- else %}" +
        "{%- set system_message = '' %}" +
    "{%- endif %}" +

    "{#- System message #}" +
    "{{- '<|start_header_id|>system<|end_header_id|>\n\n' }}" +
    "{%- if tools is not none %}" +
        "{{- 'Environment: ipython\n' }}" +
    "{%- endif %}" +
    "{{- 'Cutting Knowledge Date: December 2023\n' }}" +
    "{{- 'Today Date: ' + date_string + '\n\n' }}" +
    "{%- if tools is not none and not tools_in_user_message %}" +
        "{{- 'You have access to the following functions. To call a function, please respond with JSON for a function call.' }}" +
        "{{- 'Respond in the format {\"name\": function name, \"parameters\": dictionary of argument name and its value}.' }}" +
        "{{- 'Do not use variables.\n\n' }}" +
        "{%- for t in tools %}" +
            "{{- t | dump(4) }}" +
            "{{- '\n\n' }}" +
        "{%- endfor %}" +
    "{%- endif %}" +
    "{{- system_message }}" +
    "{{- '<|eot_id|>' }}" +

    "{# Custom tools are passed in a user message with some extra guidance #}" +
    "{%- if tools_in_user_message and tools is not none %}" +
        "{#- Extract the first user message so we can plug it in here #}" +
        "{%- if messages.length != 0 %}" +  // Use messages.length for JS arrays
            "{%- set first_user_message = messages[0]['content'] | trim %}" + // Added space around pipe
            "{%- set messages = messages.slice(1) %}" +
        "{%- else %}" +
            "{{- raise_exception('Cannot put tools in the first user message when there is no first user message!') }}" +
        "{%- endif %}" +
        "{{- '<|start_header_id|>user<|end_header_id|>\n\n' }}" +
        "{{- 'Given the following functions, please respond with a JSON for a function call ' }}" +
        "{{- 'with its proper arguments that best answers the given prompt.\n\n' }}" +
        "{{- 'Respond in the format {\"name\": function name, \"parameters\": dictionary of argument name and its value}.' }}" +
        "{{- 'Do not use variables.\n\n' }}" +
        "{%- for t in tools %}" +
            "{{- t | dump(4) }}" +
            "{{- '\n\n' }}" +
        "{%- endfor %}" +
        "{{- first_user_message + '<|eot_id|>' }}" +
    "{%- endif %}" +

    "{%- for message in messages %}" +
        "{%- if not (message.role == 'ipython' or message.role == 'tool' or 'tool_calls' in message) %}" +
            "{{- '<|start_header_id|>' + message['role'] + '<|end_header_id|>\n\n' + message['content'] | trim + '<|eot_id|>' }}" + 
        "{%- elif 'tool_calls' in message %}" +
            "{%- if message.tool_calls.length != 1 %}" +
                "{{- raise_exception('This model only supports single tool-calls at once!') }}" +
            "{%- endif %}" +
            "{%- set tool_call = message.tool_calls[0].function %}" +
            "{{- '<|start_header_id|>assistant<|end_header_id|>\n\n' }}" +
            "{{- '{\"name\": \"' + tool_call.name + '\", ' }}" +
            "{{- '\"parameters\": ' }}" +
            "{{- tool_call.arguments | dump }}" +
            "{{- '}' }}" +
            "{{- '<|eot_id|>' }}" +
        "{%- elif message.role == 'tool' or message.role == 'ipython' %}" +
            "{{- '<|start_header_id|>ipython<|end_header_id|>\n\n' }}" +
            "{%- if message.content is mapping or message.content is iterable %}" +
                "{{- message.content | dump }}" +
            "{%- else %}" +
                "{{- message.content }}" +
            "{%- endif %}" +
            "{{- '<|eot_id|>' }}" +
        "{%- endif %}" +
    "{%- endfor %}" +
    "{%- if add_generation_prompt %}" +
        "{{- '<|start_header_id|>assistant<|end_header_id|>\n\n' }}" +
    "{%- endif %}"
};

export default llama32Template;