class AddGroupNumberToTutorial < ActiveRecord::Migration
  def change
    # not really a number, but a string like "T01", "T02", and etc.
    add_column :tutorials, :group_number, :string
  end
end
