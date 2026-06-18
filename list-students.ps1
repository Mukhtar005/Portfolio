
$students = Get-Content -Path "data\students.json" -Raw | ConvertFrom-Json
Write-Host "All 30 students - Login (Last Name) and Password (First Name):"
Write-Host "=" * 80
foreach ($student in $students) {
    $parts = $student.name -split " "
    $login = $parts[0]
    $password = $parts[1]
    Write-Host "ID: $($student.id), Name: $($student.name)"
    Write-Host "  Login: $login"
    Write-Host "  Password: $password"
    Write-Host "-" * 80
}
