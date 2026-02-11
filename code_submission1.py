import csv

def parse_csv_file(file_path: str) -> list[dict]:
    """
    Parse a CSV file and return a list of dictionaries.
    
    Args:
        file_path: Path to the CSV file
        
    Returns:
        List of dictionaries where each dict represents a row
    """
    result = []
    
    # Open and read the CSV file
    with open(file_path, 'r') as file:
        csv_reader = csv.DictReader(file)
        
        for row in csv_reader:
            result.append(row)
    
    return result
