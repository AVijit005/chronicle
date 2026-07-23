$file = "apps/backend/src/analytics/analytics.repository.ts"
$content = Get-Content $file -Raw
$content = $content -replace "where: { userId, rating: { not: null } }", "where: { userId, rating: { not: null }, deletedAt: null }"
$content = $content -replace "where: { userId, favorite: true,  }", "where: { userId, favorite: true, deletedAt: null }"
$content = $content -replace "where: { userId,  bookmarked: true }", "where: { userId, bookmarked: true, deletedAt: null }"
$content = $content -replace "where: { userId, createdAt: { gte: startDate },  }", "where: { userId, createdAt: { gte: startDate }, deletedAt: null }"
$content = $content -replace "where: { userId, createdAt: { gte: startDate } }", "where: { userId, createdAt: { gte: startDate }, deletedAt: null }"
$content = $content -replace "where: { userId, createdAt: { gte: startDate, lte: endDate } }", "where: { userId, createdAt: { gte: startDate, lte: endDate }, deletedAt: null }"
$content = $content -replace "where: { userId, updatedAt: { gte: startDate, lte: endDate }, status: 'COMPLETED',  }", "where: { userId, updatedAt: { gte: startDate, lte: endDate }, status: 'COMPLETED', deletedAt: null }"
Set-Content -Path $file -Value $content
