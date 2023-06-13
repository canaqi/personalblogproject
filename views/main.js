// Assuming you're using jQuery for AJAX requests

$(document).ready(() => {
    // Handle form submission
    $('#blog-form').submit((event) => {
      event.preventDefault(); // Prevent the form from submitting normally
  
      // Get the form data
      const title = $('#title').val();
      const content = $('#content').val();
  
      // Perform AJAX request to create a new blog
      $.ajax({
        method: 'POST',
        url: '/api/blogs', // Replace with the correct URL to create a new blog
        data: {
          title: title,
          content: content,
        },
        success: (response) => {
          // Handle the success response, e.g., show a success message, refresh the blog list, etc.
          console.log('Blog created:', response);
        },
        error: (xhr, status, error) => {
          // Handle the error response, e.g., display an error message
          console.error('Error creating blog:', error);
        },
      });
  
      // Clear the form fields
      $('#title').val('');
      $('#content').val('');
    });
  });
  