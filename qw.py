a = 0, 3, 16, 6, 12, 31, 8, 15, 18, 15, 16, 9, 11, 9, 3, 27, 9, 14, 18, 11, 9, 3, 27, 13, 6, 7, 5, 19, 18, 23, 6, 11, 14, 3, 6, 10, 1, 18, 23, 10
h = [0]*(int(len(a))+1)
for i in range(0, len(a)):
    h[i+1]=((a[i+1]+h[i])**2)%1 1
    print(a[i+1], h[i+1])