import csv
import os
import re
import logging
from typing import List, Dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def parse_csv_file(file_path: str) -> List[Dict[str, str]]:
    """
    Parse a CSV file and return a list of dictionaries with security measures.
    
    This function reads a CSV file, validates the file path for security,
    handles various error conditions, and returns the data as a list of dictionaries.
    
    Args:
        file_path (str): Path to the CSV file to be parsed
        
    Returns:
        List[Dict[str, str]]: List of dictionaries where each dictionary represents
                              a row with column headers as keys. Returns empty list
                              if file is empty or errors occur.
    
    Examples:
        >>> parse_csv_file('data.csv')
        [{'name': 'John', 'age': '30'}, {'name': 'Jane', 'age': '25'}]
        
        >>> parse_csv_file('empty.csv')
        []
        
        >>> parse_csv_file('../etc/passwd')  # Path traversal blocked
        []
    
    Security Features:
        - Validates against path traversal attacks
        - Sanitizes column headers to prevent code injection
        - Limits file size to 10MB maximum
        - Comprehensive error handling and logging
    """
    result = []
    
    # REQ-17: Validate that file_path is a string and not None/empty
    if not file_path or not isinstance(file_path, str):
        logger.error("Invalid file_path: must be a non-empty string")
        return []
    
    # REQ-9: Prevent path traversal attacks
    if '..' in file_path:
        logger.error(f"Path traversal attempt detected in: {file_path}")
        return []
    
    try:
        # REQ-11: Limit file size to maximum 10MB
        file_size = os.path.getsize(file_path)
        max_size = 10 * 1024 * 1024  # 10MB in bytes
        if file_size > max_size:
            logger.error(f"File size {file_size} bytes exceeds maximum of {max_size} bytes")
            return []
        
        # REQ-5: Handle empty CSV files gracefully
        if file_size == 0:
            logger.info(f"Empty file detected: {file_path}")
            return []
        
        # REQ-4: Handle FileNotFoundError explicitly
        # REQ-12: Handle PermissionError
        # REQ-13: Handle UnicodeDecodeError
        with open(file_path, 'r', encoding='utf-8') as file:
            # REQ-6: Use csv module from Python standard library
            csv_reader = csv.DictReader(file)
            
            # REQ-10: Sanitize column headers to prevent code injection
            if csv_reader.fieldnames:
                sanitized_fieldnames = []
                for header in csv_reader.fieldnames:
                    # Remove special characters, keep only alphanumeric and underscore
                    sanitized_header = re.sub(r'[^a-zA-Z0-9_]', '', header)
                    sanitized_fieldnames.append(sanitized_header)
                csv_reader.fieldnames = sanitized_fieldnames
            
            # REQ-2: Read and parse CSV file
            # REQ-7: First row treated as headers/keys
            for row in csv_reader:
                result.append(row)
        
        # REQ-8: Return empty list if file is empty (after headers)
        if len(result) == 0:
            logger.info(f"No data rows found in: {file_path}")
        else:
            logger.info(f"Successfully parsed {len(result)} rows from: {file_path}")
        
        # REQ-3: Return list of dictionaries
        return result
    
    except FileNotFoundError:
        # REQ-4 & REQ-14: Handle and log FileNotFoundError
        logger.error(f"File not found: {file_path}")
        return []
    
    except PermissionError:
        # REQ-12 & REQ-14: Handle and log PermissionError
        logger.error(f"Permission denied when trying to read: {file_path}")
        return []
    
    except UnicodeDecodeError:
        # REQ-13 & REQ-14: Handle and log UnicodeDecodeError
        logger.error(f"Unicode decode error - file is not UTF-8 encoded: {file_path}")
        return []
    
    except Exception as e:
        # REQ-14: Log all other errors with appropriate messages
        logger.error(f"Unexpected error parsing {file_path}: {str(e)}")
        return []
